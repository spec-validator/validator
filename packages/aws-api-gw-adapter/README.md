# @spec-validator/aws-api-gw-adapter

To power lambda serving AWS API GW use you need the following:

```ts
// api-gw-app/src/index.ts

import { createAwsLambdaHandler } from '@spec-validator/aws-api-gw-adapter'

import {
  segmentField as $, stringField,
} from '@spec-validator/validator/fields'

import { _ } from '@spec-validator/rest-api-server'

import { expectType } from '@spec-validator/test-utils/expectType'

export const handle = createAwsLambdaHandler({
  routes: [
    _.GET($._('/items')).spec({
      response: {
        body: [{
          title: stringField(),
          description: stringField(),
        }],
      },
    }).handler(async () => ({
      body: [
        {
          title: 'Item 1',
          description: 'Description of item 1',
        },
      ],
    })),
  ],
})

expectType<typeof handle, (event: {
  headers: Record<string, string>,
  path: string,
  queryStringParameters: Record<string, string>,
  httpMethod: string,
  body?: string,
  requestContext: {
    stage: string
  }
}) => Promise<{
  body?: string,
  headers?: Record<string, any>,
  statusCode: number
}>>(true)
```
