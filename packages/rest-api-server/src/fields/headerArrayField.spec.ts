import { expectType } from '@spec-validator/test-utils/expectType'
import { TypeHint } from '@spec-validator/validator'
import { booleanField, stringField } from '@spec-validator/validator/fields'
import { testValidateSpecError, testValidateSpecOk } from '@spec-validator/validator/TestUtils.test'

import arrayField from './headerArrayField'


const field = arrayField(booleanField())

describe('field', () => {

  it('works with urlendcoding', () => {
    const withStr = arrayField(stringField())
    testValidateSpecOk(withStr, '%D0%B0%D0%B1%D1%81, %D0%B1%D0%B1', ['абс', 'бб'])
  })

  it('valid', () => {
    testValidateSpecOk(field, 'true', [true])
  })

  it('not a string', () => {
    testValidateSpecError(field, true, 'Not a string')
  })

  it('invalid item', () => {
    testValidateSpecError(field, 'true, true, 11', {'inner': 'Not a boolean', 'path': [2]})
  })
})

test('types', () => {
  type Spec = TypeHint<typeof field>

  expectType<Spec, boolean[]>(true)
})
