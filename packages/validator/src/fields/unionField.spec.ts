import unionField from './unionField'
import { TypeHint, validate } from '../core'
import { expectType } from '../TypeTestUtils.test'
import booleanField from './booleanField'
import choiceField from './choiceField'
import stringField from './stringField'

const choices = choiceField([1, 2, 3])

const field = unionField(
  [stringField(), choices, booleanField()],
)

describe('field', () => {
  it('should allow undefined value go through', () => {
    expect(validate(field, 1)).toEqual(1)
    expect(validate(field, 3)).toEqual(3)
    expect(validate(field, true)).toEqual(true)
  })

})

test('types', () => {
  type Spec = TypeHint<typeof field>

  expectType<string | boolean | 1 | 2 | 3>('foo' as Spec)
})
