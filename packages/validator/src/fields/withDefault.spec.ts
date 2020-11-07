import withDefault from './withDefault'
import { TypeHint, validate } from '../core'
import { expectType } from '../TypeTestUtils.test'
import numberField from './numberField'

const field = withDefault(numberField(), 42)

describe('field', () => {
  it('should allow undefined value go through', () => {
    const value = validate(field, undefined)
    expect(value).toEqual(42)
  })

  it('should allow undefined nested value go through', () => {
    const value = validate({
      inner: field,
    }, {})
    expect(value.inner).toEqual(42)
  })

  it('should allow defined nested value go through', () => {
    const value = validate({
      inner: field,
    }, {
      inner: 57,
    })
    expect(value.inner).toEqual(57)
  })
})

test('types', () => {
  type Spec = TypeHint<typeof field>

  expectType<number>(42 as Spec)
})
