import { createAwsLambdaHandler, createUnboundEnvStore } from '.'

test('index', () => {
  expect(createAwsLambdaHandler).toBeTruthy()
  expect(createUnboundEnvStore).toBeTruthy()
})
