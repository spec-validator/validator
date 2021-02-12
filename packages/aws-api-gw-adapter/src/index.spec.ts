import { _ } from '@spec-validator/rest-api-server/handler'
import { segmentField as $, numberField, stringField } from '@spec-validator/validator/fields'
import { createAwsLambdaHandler } from '.'

test('entrypoint', async () => {
  const awsRequest = {
    headers: {
      keyIn: 'valueIn',
      'content-type': 'application/json',
    },
    path: '/items/42',
    queryStringParameters: { qkey: 'qvalue' },
    httpMethod: 'POST',
    body: JSON.stringify({
      title: 'Title',
      description: 'Description',
    }),
  }

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
