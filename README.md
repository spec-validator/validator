# spec-validator

The main rationale of the package is to ensure that a developer
defines structure of service's data once and in one place and
all other representations of that structure are deduced dynamically
without any code generation.

A developer can create a type safe REST API with:

- run-time payload validation
- build-time type checking
- dynamic API docs' generation (e.g. OpenAPI)
- type inference and autocompletion in the editor

and do so entirely with TypeScript in one place without wrtitng even a single line of JSON schemas or YAML based specs (though those are generated at runtime later on).

## Packages

- [validator](packages/validator/README.md)

  Core validation logic - the necessary bits to glue
  payload specifications with TypeScript datastructures.

- [rest-api-server](packages/rest-api-server/README.md)

  REST API primitives such as a binding to node's http server
  and type-safe specification of HTTP protocol.

- [open-api-endpoint](packages/open-api-endpoint/README.md)

  Two endpoints to generate Open API based documentation for
  the routes defined using the `rest-api-server`.
