# @spec-validator/open-api-endpoint

The endpoint decorates server configs with an additional set of
routes that generate open-api spec and a ui for it.

```ts
import http from 'http'

import { createServer, _ } from '@spec-validator/rest-api-server'
import {
  $, numberField, stringField,
} from '@spec-validator/validator/fields'
import { withOpenApi } from '@spec-validator/open-api-endpoint'
import { expectType } from '@spec-validator/test-utils/expectType'

const itemSpec = {
  title: stringField(),
  description: stringField(),
}

const server = createServer(withOpenApi({
  baseUrl: 'http://localhost:8080',
  routes: [
    _.POST($._('/items')).spec({
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
    })),
    _.GET($._('/items')).spec({
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
  ]
}))

expectType<http.Server & { serve: () => http.Server }, typeof server>(true)
```

Once served via a regular call:

```ts #ignore
server.serve()
```

OpenApi ui will be available at http://localhost:8080/open-api-ui
without any additional effort.
