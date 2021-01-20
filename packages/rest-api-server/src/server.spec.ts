import request from 'supertest'

import {
  $, constantField, numberField, objectField, optional, stringField, unionField,
} from '@spec-validator/validator/fields'


import { createServer, _ } from './server'
import { route } from './route'
import { headerArrayField, headerObjectField } from './fields'

const itemSpec = {
  title: stringField(),
  description: stringField(),
}

const ofItems = {
  body: [itemSpec],
}

const ofItem = {
  body: itemSpec,
}

// TODO: disablable error on extra keys for object field
const server = createServer({routes: [
  _.GET($._('/expected-error')).spec(
    {
      response: {
        body: constantField(42),
      },
    }
  ).handler(
    async () => {
      throw {
        statusCode: 442,
        isPublic: true,
        reason: 'Boom!',
      }
    }
  ),
  route({
    request: {
      method: constantField('GET'),
      pathParams: $._('/multi-response'),
    },
    response: unionField({
      statusCode: constantField(400),
    }, {
      statusCode: constantField(200),
    }),
  }).handler( async () => ({
    statusCode: 200,
  }),
  ),
  _.GET($._('/unexpected-error')).spec(
    {
      response: {
        body: constantField(42),
      },
    }
  ).handler(
    async () => {
      throw {
        reason: 'Boom!',
      }
    }
  ),
  _.GET($._('/items')).spec(
    {
      response: ofItems,
    },
  ).handler(
    async () => ({
      body: [
        {
          title: 'Item N',
          description: 'Description',
        },
      ],
    })
  ),
  _.POST($._('/items')).spec(
    {
      request: ofItem,
      response: {
        body: numberField(),
        headers: {
          title: stringField(),
        },
      },
    },
  ).handler(
    async () => ({
      body: 42,
      headers: {
        title: 'Foo',
      },
    })
  ),
  _.GET($._('/items/')._('id', numberField())).spec(
    {
      response: ofItem,
    },
  ).handler(
    async (req) => ({
      body:
        {
          title: `Item ${req.pathParams.id}`,
          description: 'Description',
        },
    })
  ),
  _.PUT($._('/items/')._('id', numberField())).spec(
    {
      request: ofItem,
    },
  ).handler(
    async () => undefined
  ),
  _.PATCH($._('/items/')._('id', numberField())).spec(
    {
      request: {
        body: objectField({
          title: optional(stringField()),
          description: optional(stringField()),
        }),
      },
    },
  ).handler(
    async () => undefined
  ),
  _.DELETE($._('/items/')._('id', numberField())).spec({}).handler(
    async () => undefined
  ),
  _.GET($._('/with-complex-headers')).spec(
    {
      response: {
        headers: {
          one: stringField(),
          many: headerArrayField(numberField()),
          cookies: headerObjectField({
            auth: stringField(),
            username: stringField(),
          }),
        },
      },
    },
  ).handler(
    async () => ({
      headers: {
        one: 'foo',
        many: [42],
        cookies: {
          auth: 'Payload',
          username: 'User',
        },
      },
    })
  ),
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
    'reason': 'Not supported \'content-type\': application/xml',
  }))
})

test('if Accept media type is unsupported - 415 status code is returned', async () => {
  const resp = await request(server).get('/items').set('Accept', 'application/xml')
  expect(resp.status).toEqual(415)
  expect(resp.text).toEqual(JSON.stringify({
    'statusCode':415,
    'isPublic':true,
    'reason':'Not supported \'accept\': application/xml',
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

test('with-complex-headers', async () => {
  const resp = await request(server).get('/with-complex-headers')
  delete resp.headers.date
  delete resp.headers.url
  expect(resp).toMatchSnapshot()
})

test('POST', async () => {
  const resp = await request(server).post('/items').set('Content-Type', 'application/json').send({
    title: 'Title',
    description: 'Description',
  })
  expect(resp.status).toEqual(201)
  expect(resp.body).toEqual(42)
})

test('PUT', async () => {
  const resp = await request(server).put('/items/11').set('Content-Type', 'application/json').send({
    title: 'Title',
    description: 'Description',
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

test('retains content-type if it is passed as a header from the handler', async () => {
  // TODO
})
