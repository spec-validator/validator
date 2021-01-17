# @spec-validator/rest-api-server

The library provides a set of types that specifies HTTP protocol.

Aside of the types it also implements the core logic of an HTTP
server that on the one hand routinely handles incoming requests
and does the routing in a similar fashion `express` does it
and on the other hand leverages type specifications to validate
the incoming requests.

## Routes

The core building block of a server is a route.

The route is a combination of essentially 3 things:

- request object specification
- response object specification
- handler that gets a valid request object as its only parameter and
  returns a valid response object

```ts
import { route, Route } from '@spec-validator/rest-api-server'
import { expectType } from '@spec-validator/test-utils/expectType'
import {
  $, choiceField, numberField, stringField,
  unionField, constantField,
} from '@spec-validator/validator/fields'

const routeObject = route({
  request: {
    method: constantField('GET'),
    headers: {
      headerKey: stringField(),
    },
    pathParams: $._('pathKey', stringField()),
  },
  response: unionField(
    {
      statusCode: constantField(201),
      data: numberField(),
    }, {
      statusCode: constantField(202),
      data: choiceField('one', 'two'),
      headers: {
        headerKey: stringField(),
    },
  }),
}).handler(async (request) => ({
  statusCode: 202,
  data: 'one',
  headers: {
    headerKey: request.pathParams.pathKey,
  },
}))

expectType<Route, typeof routeObject>(true)
```

### Fluent API for the most common case

There is a fluent API aiming to simplify route configuration in the
most common case (one 200ish response per handler, known status
codes for various request methods).

```ts
import { _ } from '@spec-validator/rest-api-server'

const itemSpec = {
  title: stringField(),
  description: stringField(),
}

const getRoute = _.GET($._('/items')).spec({
  response: {
    data: [itemSpec],
  },
}).handler(async () => ({
  data: [
    {
      title: 'Item N',
      description: 'Description',
    },
  ],
}))

expectType<Route, typeof getRoute>(true)

const postRoute = _.POST($._('/items')).spec({
  request: {
    data: itemSpec,
  },
  response: {
    data: numberField(),
    headers: {
      title: stringField(),
    },
  },
}).handler(async () => ({
  data: 42,
  headers: {
    title: 'Foo',
  },
}))

expectType<Route, typeof postRoute>(true)
```
