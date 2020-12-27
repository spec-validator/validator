import { choiceField, objectField, stringField } from '@validator/validator/fields'
import $ from '@validator/validator/fields/segmentField'
import { expectType } from '@validator/validator/TypeTestUtils.test'
import { Route } from './route'

describe('Route', () => {

  it('works with defined request and response', () => {
    const reqSpec = {
      method: choiceField('GET'),
      headers: objectField({
        headerKey: stringField()
      }),
      pathParams: $._('pathKey', stringField())
    }

    const respSpec = {
      statusCode: choiceField(201),
      data: stringField(),
    }

    type Decor = Route<typeof reqSpec, typeof respSpec>

    expectType<Decor, {
      request: typeof reqSpec,
      response: typeof respSpec,
      handler: (request: {
        method: 'GET',
        headers: { headerKey: string },
        pathParams: { pathKey: string },
      }) => Promise<{
        statusCode: 201,
        data: string
      }>
        }>(true)
  })

})
