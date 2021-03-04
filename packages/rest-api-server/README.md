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
  segmentField as $, choiceField, numberField, stringField,
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
      body: numberField(),
    }, {
      statusCode: constantField(202),
      body: choiceField('one', 'two'),
      headers: {
        headerKey: stringField(),
    },
  }),
}).handler(async (request) => ({
  statusCode: 202,
  body: 'one',
  headers: {
    headerKey: request.pathParams.pathKey,
  },
}))

expectType<Route, typeof routeObject>(true)
```

Note, the routes do not handle trafic in any meaningful way,
they are just a specification for the handlers.

### Fluent API for the most common case

There is a fluent API aiming to simplify route configuration in the
most common case (one 200ish response per handler, known status
codes for various request methods).

```ts
import { createRouteCollection  } from '@spec-validator/rest-api-server'

const itemSpec = {
  title: stringField(),
  description: stringField(),
}

// 'routes' is a list that effectively will aggregate the routes
// defined via a '_' helper object
const _ = createRouteCollection()

// As an alternative you may import '_' singleton object that is
// not linked to any routes collection. In that case you would need
// to add routes to the collections explicitly via 'routes.push'

/**
import { _ } from '@spec-validator/rest-api-server'

const routes: Route[] = []

routes.push(_.GET(...).spec(...).handler(...))
*/

const getRoute = _.GET($._('/items')).spec({
  response: {
    body: [itemSpec],
  },
}).handler(async () => ({
  body: [
    {
      title: 'Item N',
      description: 'Description',
    },
  ],
}))

expectType<Route, typeof getRoute>(true)

const postRoute = _.POST($._('/items')).spec({
  request: {
    body: itemSpec,
  },
  response: {
    body: numberField(),
    headers: {
      title: stringField(),
    },
  },
}).handler(async () => ({
  body: 42,
  headers: {
    title: 'Foo',
  },
}))

expectType<Route, typeof postRoute>(true)
```

## Server object

For any arbitrary set of routes it is possible to join those with
extra parameters to craft server configs:

```ts
import { createServer } from '@spec-validator/rest-api-server'

import http from 'http'

const server = createServer({
  baseUrl: 'http://localhost:8080',
  routes: _.routes
})

expectType<http.Server & { serve: () => http.Server }, typeof server>(true)
```

## Running the app

To actually run the server and handle trafic using it,
run `serve` method:

```ts #ignore

server.serve()

```

Once the app is started you may run the following curl command to obtain the
payload from the endpoint:

```
curl -X GET "http://localhost:8080/items"
```

Or post a new entry:

```
curl -X POST "http://localhost:8080/items" -H  "Content-Type: application/json" \
  -d "{\"title\":\"string\",\"description\":\"string\"}"
```

The following call will produce a 400 (validation) error:

```
curl -X POST "http://localhost:8080/items" -H  "Content-Type: application/json" \
  -d "{\"title\":true,\"description\":\"string\"}"
```

## Cheat sheet

Response with cookies:

```ts
import { headerObjectField } from '@spec-validator/rest-api-server/fields'

const withCookies = _.GET($._('/with-cookies')).spec({
  response: {
    body: [itemSpec],
    headers: {
      cookies: headerObjectField({
        cookieStr: stringField(),
        cookieNum: numberField()
      })
    }
  },
}).handler(async () => ({
  body: [
    {
      title: 'Item N',
      description: 'Description',
    },
  ],
  headers: {
    cookies: {
      cookieStr: 'foo',
      cookieNum: 42
    }
  }
}))

expectType<Route, typeof withCookies>(true)
```

Request with authorization:

```ts
const withAuthorization = _.POST($._('/with-cookies')).spec({
  request: {
    headers: {
      authorization: $._('type', stringField())._(' ')._('credentials', stringField())
    }
  }
}).handler(async () => undefined)


expectType<Route, typeof withAuthorization>(true)
```
