import request from 'supertest'

import { $, arrayField, numberField, objectField, stringField } from '@validator/validator/fields'

import { createServer } from './server'

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
      request: ofItems,
    },
    async () => undefined
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
  DELETE($._('/items/')._('id', numberField()),
    {},
    async () => undefined
  )
]})

test('a handler with valid method & route is matched and executed', async () => {
  const resp = await request(server).get('/items')
  expect(resp.status).toEqual(200)
  expect(resp.body).toEqual([{'description': 'Description', 'title': 'Item N'}])
})

test('if no valid handler is matched - 404 status code is returned', async () => {
  const resp = await request(server).get('/missing')
  expect(resp.status).toEqual(404)
})

test('if Content-Type media type is unsupported - 415 status code is returned', async () => {
  const resp = await request(server).post('/items').set('Content-Type', 'application/xml')
  expect(resp.status).toEqual(415)
  expect(resp.text).toEqual('{"statusCode":415,"isPublic":true,"reason":"Not supported: content-type"}')
})

test('if Accept media type is unsupported - 415 status code is returned', async () => {
  const resp = await request(server).get('/items').set('Accept', 'application/xml')
  expect(resp.status).toEqual(415)
  expect(resp.text).toEqual('{"statusCode":415,"isPublic":true,"reason":"Not supported: accept"}')
})

test('if request is invalid - 400 status code is returned', () => {
  // TODO
})

test('if handler fails with status code in an eror - the status code is returned', () => {
  // TODO
})

test('if handler fails without status code - 500 status code is returned', () => {
  // TODO
})
