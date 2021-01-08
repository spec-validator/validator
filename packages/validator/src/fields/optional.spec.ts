import optional from './optional'
import numberField from './numberField'
import { TypeHint } from '../core'
import { expectType } from '../TypeTestUtils.test'
import { testValidateSpecOk } from '../TestUtils.test'

const field = optional(numberField())

describe('field', () => {
  it('should allow undefined value go through', () => {
    testValidateSpecOk(field, undefined)
  })

  it('should allow undefined nested value go through', () => {
    testValidateSpecOk({
      inner: field,
    }, {
      inner: undefined,
    })
  })

  it('should allow defined nested value go through', () => {
    testValidateSpecOk({
      inner: field,
    }, {
      inner: 57,
    })
  })
})

test('types', () => {
  type Spec = TypeHint<typeof field>

  expectType<Spec, number | undefined>(true)
})
