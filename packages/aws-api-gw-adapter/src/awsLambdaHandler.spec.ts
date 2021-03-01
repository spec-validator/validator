import { _ } from '@spec-validator/rest-api-server/handler'
import { segmentField as $, numberField, stringField } from '@spec-validator/validator/fields'
import { createAwsLambdaHandler, configureBaseUrl } from './awsLambdaHandler'

const awsRequest = {
  headers: {
    keyIn: 'valueIn',
    'content-type': 'application/json',
    Host: 'example.com',
  },
  path: '/items/42',
  queryStringParameters: { qkey: 'qvalue' },
  httpMethod: 'POST',
  requestContext: {
    stage: 'dev',
  },
  body: JSON.stringify({
    title: 'Title',
    description: 'Description',
  }),
}


describe('configureBaseUrl', () => {
  beforeEach(() => {
    delete process.env.REST_API_BASE_URL
  })

  afterEach(() => {
    delete process.env.REST_API_BASE_URL
  })

  it('fills empty placeholders with strings', () => {
    configureBaseUrl({
      ...awsRequest,
      headers: {},
    })
    expect(process.env.REST_API_BASE_URL).toEqual(
      'http://unknown'
    )
  })

  it('uses staged aws url in case of amazonaws.com urls', () => {
    configureBaseUrl({
      ...awsRequest,
      headers: {
        Host: 'api-gw.amazonaws.com',
      },
    })
    expect(process.env.REST_API_BASE_URL).toEqual(
      'http://api-gw.amazonaws.com/dev'
    )
  })

  it('uses defined domain if any', () => {
    configureBaseUrl({
      ...awsRequest,
      headers: {
        Host: 'example.com',
        'X-Forwarded-Proto': 'https',
      },
    })
    expect(process.env.REST_API_BASE_URL).toEqual(
      'https://example.com'
    )
  })
})

test('entrypoint', async () => {
  expect(await createAwsLambdaHandler({
    routes: [
      _.POST($._('/items/')._('id', numberField())).spec(
        {
          request: {
            queryParams: {
              qkey: stringField(),
            },
            body: {
              title: stringField(),
              description: stringField(),
            },
            headers: {
              keyIn: stringField(),
            },
          },
          response: {
            body: {
              id: numberField(),
              title: stringField(),
              key: stringField(),
            },
          },
        },
      ).handler(
        async (req) => ({
          body: {
            id: req.pathParams.id,
            title: req.body.title,
            key: req.queryParams.qkey,
          },
        })
      ),
    ],
  })(awsRequest)).toMatchSnapshot()

})
