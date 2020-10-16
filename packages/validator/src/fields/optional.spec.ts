import optional from './optional'
import numberField from './numberField'
import { TypeHint, validate } from '../core'
import { expectType } from '../TypeTestUtils.test'

const field = optional(numberField())

describe('field', () => {
  it('should allow undefined value go through', () => {
    const value = validate(field, undefined)
    expect(value).toEqual(undefined)
  })

  it('should allow undefined nested value go through', () => {
    const value = validate({
      inner: field
    }, {})
    expect(value.inner).toEqual(undefined)
  })

  it('should allow defined nested value go through', () => {
    const value = validate({
      inner: field
    }, {
      inner: 57
    })
    expect(value.inner).toEqual(57)
  })
})

test('types', () => {
  type Spec = TypeHint<typeof field>

  expectType<number | undefined>(42 as Spec)
})
