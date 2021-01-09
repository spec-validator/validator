import optional from './optional'
import { TypeHint } from '../core'
import { expectType } from '../TypeTestUtils.test'
import { sampleField, testValidateSpecOk } from '../TestUtils.test'

const field = optional(sampleField)

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
      inner: true,
    })
  })
})

test('types', () => {
  type Spec = TypeHint<typeof field>

  expectType<Spec, true | undefined>(true)
})
