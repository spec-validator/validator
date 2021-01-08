import unionField from './unionField'
import { TypeHint } from '../core'
import { expectType } from '../TypeTestUtils.test'
import { objectField, booleanField , choiceField, stringField } from '.'
import { testValidateSpecError, testValidateSpecOk } from './TestUtils.test'

const field = unionField(
  stringField(),
  choiceField(1, 2, 3),
  booleanField(),
  objectField({
    innerField: stringField(),
  })
)

test('field', () => {
  testValidateSpecOk(field, 1)
  testValidateSpecOk(field, 3)
  testValidateSpecOk(field, true)
  testValidateSpecOk(field, 'foo')
  testValidateSpecOk(field, {
    innerField: 'foo',
  })
  testValidateSpecError(field, undefined, 'Invalid variant')
})

test('types', () => {
  type Spec = TypeHint<typeof field>

  expectType<Spec, string | boolean | 1 | 2 | 3 | { innerField: string }>(true)
})
