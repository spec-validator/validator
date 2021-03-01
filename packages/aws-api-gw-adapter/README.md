# @spec-validator/aws-api-gw-adapter

To power lambda serving AWS API GW you need the following:

```ts api-gw-app/src/index.ts
import { createAwsLambdaHandler, createUnboundEnvStore } from '@spec-validator/aws-api-gw-adapter'

import {
  segmentField as $, stringField,
} from '@spec-validator/validator/fields'

import { _ } from '@spec-validator/rest-api-server'

import { expectType } from '@spec-validator/test-utils/expectType'

// NOTE: this is a typesafe way of bridging environment variables from CDK
// to the ones within lambda
export const createEnvStore = createUnboundEnvStore(
  'ENTRYPOINT_REGION',
)

const envs = createEnvStore()

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
          description: `Region is ${envs.ENTRYPOINT_REGION}`,
        },
      ],
    })),
  ],
})
```

Handler's type should be as follows:

```ts api-gw-app/src/index.ts
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

CDK part for the lambda above may look as follows:

```ts #api-gw-app/cdk.ts
import * as lambda from '@aws-cdk/aws-lambda'
import * as nLambda from '@aws-cdk/aws-lambda-nodejs'
import * as logs from '@aws-cdk/aws-logs'

import { createEnvStore } from './src'

const lambdaStack = (region: string) => {
  const stack = new cdk.Stack(app, `${name}-RestApi`, {
    env,
  })

  ...

  const entryPoint = new nLambda.NodejsFunction(stack, `${name}-EntryPoint`, {
    entry: `${__dirname}/src/index.ts`,
    runtime: lambda.Runtime.NODEJS_14_X,
    functionName: `${name}-RestApi-EntryPoint`,
    tracing: lambda.Tracing.DISABLED,
    logRetention: logs.RetentionDays.ONE_MONTH,
    bundling: {
      tsconfig: `${__dirname}/tsconfig.json`,
      minify: true,
      sourceMap: true,
      target: 'es2020',
    },
  })

  // NOTE: here we bind setter of the environment variable to
  // addEnvironment method of a lambda function
  const store = createEnvStore((key, value) => entryPoint.addEnvironment(key, value))

  // Only known keys can be set
  store.ENTRYPOINT_REGION = region

  ...
}
```
