import { numberField, objectField } from '.'
import { TypeHint } from '..'
import { expectType } from '../TypeTestUtils.test'
import { testValidateSpecError, testValidateSpecOk } from './TestUtils.test'

const field = objectField({
  field: objectField({
    num: numberField(),
    subField: objectField({
      subSubField: numberField(),
    }),
  }),
})

describe('field', () => {

  /*


test('validate with extra fields with Error', () => {
  let error: unknown
  try {
    validate({
      fieldOne: stringField(),
    }, {
      fieldOne: 'one',
      fieldTwo: 'two',
      fieldThree: 'three',
    })
  } catch (err) {
    error = err
  }
  expect(error).toEqual({
    'extraKeys': [
      'fieldTwo',
      'fieldThree',
    ],
  })

})

test('validate with extra allowed fields', () => {
  expect(
    validate({
      fieldOne: stringField(),
    }, {
      fieldOne: 'one',
      fieldTwo: 'two',
      fieldThree: 'three',
    }, true)
  ).toEqual({fieldOne: 'one'})
})
*/

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

  type Spec = TypeHint<typeof field>;

  expectType<Spec, {
    field: {
      num: number;
      subField: {
          subSubField: number;
      };
    };
  }>(true)

})
