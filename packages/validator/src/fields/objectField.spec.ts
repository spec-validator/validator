import { numberField, objectField, stringField } from '.'
import { TypeHint } from '../core'
import { expectType } from '../../../test-utils/src/expecType'
import { testValidateSpecError, testValidateSpecOk } from '../TestUtils.test'

const field = objectField({
  field: objectField({
    num: numberField(),
    subField: objectField({
      subSubField: numberField(),
    }),
  }),
})

describe('field', () => {

  it('fails with extra fields', () => {
    testValidateSpecError(
      objectField({
        fieldOne: stringField(),
      }), {
        fieldOne: 'one',
        fieldTwo: 'two',
        fieldThree: 'three',
      }, {'extraKeys': ['fieldTwo', 'fieldThree']}
    )
  })

  it('does not fail with extra fields if they are allowed', () => {
    testValidateSpecOk(
      objectField({
        fieldOne: stringField(),
      }, true), {
        fieldOne: 'one',
        fieldTwo: 11,
        fieldThree: true,
      }, {
        fieldOne: 'one',
      }, {
        fieldOne: 'one',
      }
    )
  })

  it('allows valid choices to get throw', () => {
    testValidateSpecOk(field, {
      field: {
        num: 42,
        subField: {
          subSubField: 11,
        },
      },
    })
  })

  it('prevents non object go through', () => {
    testValidateSpecError(field, 'foo', 'Not an object')
  })

  it('prevents null (it is also an object) go through', () => {
    testValidateSpecError(field, null, 'Not an object')
  })

  it('prevents bad value deep inside from going through', () => {
    testValidateSpecError(field, {
      field: {
        num: 42,
        subField: {
          subSubField: true,
        },
      },
    }, {'inner': 'Not a number', 'path': ['field', 'subField', 'subSubField']})
  })

})

test('types', () => {

  type Spec = TypeHint<typeof field>

  expectType<Spec, {
    field: {
      num: number
      subField: {
          subSubField: number
      }
    }
  }>(true)

})
