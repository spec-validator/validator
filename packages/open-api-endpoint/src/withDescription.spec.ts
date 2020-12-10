import { validate, TypeHint, getParams } from '@validator/validator'
import { numberField } from '@validator/validator/fields'
import { expectType } from '@validator/validator/TypeTestUtils.test'

import withDescription from './withDescription'

const field = withDescription(numberField(), 'Some description')

describe('field', () => {
  it('should proxy the value to the inner field', () => {
    const value = validate(field, undefined)
    expect(value).toEqual(42)
  })

  it('should annotate params with a description', () => {
    const value = getParams(field)
    expect(value).toEqual(57)
  })
})

test('types', () => {
  type Spec = TypeHint<typeof field>

  expectType<Spec, number>(true)
})
