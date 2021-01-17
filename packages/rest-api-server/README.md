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

### Fluent API

There is a fluent API aiming to simplify route configuration in the
most common case (one 200ish response per handler, known status
codes for various request methods).

```ts


```
