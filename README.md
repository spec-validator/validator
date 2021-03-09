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

and do so entirely with TypeScript in one place without wrtitng even a single
line of JSON schemas or YAML based specs (though those are generated at runtime
later on).

Please got through the [ideas' document](IDEAS.md) before diving into the API.

## Packages

- [@spec-validator/validator](packages/validator/README.md)

  Core validation logic - the necessary bits to glue
  payload specifications with TypeScript datastructures.

  `yarn add @spec-validator/validator`

- [@spec-validator/rest-api-server](packages/rest-api-server/README.md)

  REST API primitives such as a binding to node's http server
  and type-safe specification of HTTP protocol.

  `yarn add @spec-validator/rest-api-server`

- [@spec-validator/open-api-endpoint](packages/open-api-endpoint/README.md)

  Endpoint decorators to generate Open API based documentation for
  the routes defined using the `rest-api-server`.

  `yarn add @spec-validator/open-api-endpoint`

- [@spec-validator/aws-api-gw-adapter](packages/aws-api-gw-adapter/README.md)

  AWS API gateway adapter. ATM works only with a proxy route. But
  in the future will be able to bootstrap the whole set of explicit
  routes in API gateway.

  `yarn add @spec-validator/aws-api-gw-adapter`

- [@spec-validator/doc-tester](packages/doc-tester/README.md)

  A tool to validate TypeScript snippets within Markdown files.

  `yarn add --dev @spec-validator/open-api-endpoint`

- [@spec-validator/qa](packages/qa/README.md)

  A set of command-line tools to simplify working with QA of TypeScript based projects.

  `yarn add --dev @spec-validator/qa`

- [@spec-validator/cdk-auto-rest-api](packages/cdk-auto-rest-api/README.md)

  FILL ME

  `yarn add --dev @spec-validator/cdk-auto-rest-api`
