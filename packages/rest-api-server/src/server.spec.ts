import request from 'supertest'

import {
  $, arrayField, constantField, numberField, objectField, optional, stringField
} from '@validator/validator/fields'

import { createServer, PATCH } from './server'

import { GET, POST, PUT, DELETE } from './server'

const itemSpec = objectField({
  title: stringField(),
  description: stringField()
})

const ofItems = {
  data: arrayField(itemSpec)
}

const ofItem = {
  data: itemSpec
}

// TODO: disablable error on extra keys for object field
const server = createServer({routes: [
  GET($._('/expected-error'),
    {
      response: {
        data: constantField(42)
      }
    },
    async () => {
      throw {
        statusCode: 442,
        isPublic: true,
        reason: 'Boom!'
      }
    }
  ),
  GET($._('/unexpected-error'),
    {
      response: {
        data: constantField(42)
      }
    },
    async () => {
      throw {
        reason: 'Boom!'
      }
    }
  ),
  GET($._('/items'),
    {
      response: ofItems
    },
    async () => ({
      data: [
        {
          title: 'Item N',
          description: 'Description'
        }
      ]
    })
  ),
  POST($._('/items'),
    {
      request: ofItem,
      response: {
        data: numberField()
      }
    },
    async () => ({
      data: 42
    })
  ),
  GET($._('/items/')._('id', numberField()),
    {
      response: ofItem
    },
    async (request) => ({
      data:
        {
          title: `Item ${request.pathParams.id}`,
          description: 'Description'
        }
    })
  ),
  PUT($._('/items/')._('id', numberField()),
    {
      request: ofItem
    },
    async () => undefined
  ),
  PATCH($._('/items/')._('id', numberField()),
    {
      request: {
        data: objectField({
          title: optional(stringField()),
          description: optional(stringField())
        })
      }
    },
    async () => undefined
  ),
  DELETE($._('/items/')._('id', numberField()),
    {},
    async () => undefined
  )
]})

let oldLog: any = null

beforeEach(() => {
  oldLog = console.error
  console.error = jest.fn()
})

afterEach(() => {
  console.error = oldLog
})




test('if Accept media type is */* - default media type is used', async () => {
  const resp = await request(server).get('/items').set('Accept', '*/*')
  expect(resp.status).toEqual(200)
})

test('if Content-Type media type is unsupported - 415 status code is returned', async () => {
  const resp = await request(server).post('/items').set('Content-Type', 'application/xml')
  expect(resp.status).toEqual(415)
  expect(resp.text).toEqual(JSON.stringify({
    'statusCode':415,
    'isPublic':true,
    'reason':'Not supported: content-type'
  }))
})

test('if Accept media type is unsupported - 415 status code is returned', async () => {
  const resp = await request(server).get('/items').set('Accept', 'application/xml')
  expect(resp.status).toEqual(415)
  expect(resp.text).toEqual(JSON.stringify({
    'statusCode':415,
    'isPublic':true,
    'reason':'Not supported: accept'
  }))
})

test('if handler fails with status code in an error - the status code is returned', async () => {
  const resp = await request(server).get('/expected-error')
  expect(resp.status).toEqual(442)
})

test('if handler fails without status code - 500 status code is returned', async () => {
  const resp = await request(server).get('/unexpected-error')
  expect(resp.status).toEqual(500)
})

test('if request is invalid - 400 status code is returned', async () => {
  const resp = await request(server).post('/items').set('Content-Type', 'application/json').send('blob')
  expect(resp.status).toEqual(400)
})

test('POST', async () => {
  const resp = await request(server).post('/items').set('Content-Type', 'application/json').send({
    title: 'Title',
    description: 'Description'
  })
  expect(resp.status).toEqual(201)
  expect(resp.body).toEqual(42)
})

test('PUT', async () => {
  const resp = await request(server).put('/items/11').set('Content-Type', 'application/json').send({
    title: 'Title',
    description: 'Description'
  })
  expect(resp.status).toEqual(204)
})

test('DELETE', async () => {
  const resp = await request(server).delete('/items/11')
  expect(resp.status).toEqual(204)
})

test('PATCH', async () => {
  const resp = await request(server).patch('/items/11').set('Content-Type', 'application/json').send({
    title: 'Title-delta',
  })
  expect(resp.status).toEqual(204)
})
