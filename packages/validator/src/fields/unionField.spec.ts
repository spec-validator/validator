import unionField from './unionField'
import { TypeHint } from '../core'
import { expectType } from '../../../test-utils/src/expecType'
import { objectField, booleanField , choiceField, stringField } from '.'
import { testValidateSpecOk, testValidateSpecError } from '../TestUtils.test'
import { serialize } from '../interface'

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
  expect(() => serialize(field, [11] as any)).toThrowError('Invalid variant - should have matched')
})

test('types', () => {
  type Spec = TypeHint<typeof field>

  expectType<Spec, string | boolean | 1 | 2 | 3 | { innerField: string }>(true)
})
