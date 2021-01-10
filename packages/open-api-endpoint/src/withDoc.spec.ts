import { TypeHint } from '@spec-validator/validator'
import { numberField } from '@spec-validator/validator/fields'
import { expectType } from '@spec-validator/validator/TypeTestUtils.test'

import withDoc from './withDoc'

const field = withDoc(numberField(), {
  description: 'Some description',
  examples: {
    zero: {
      value: 14 as number,
      summary: 'Sample value',
    },
  },
})

describe('field', () => {
  it('should proxy the value to the inner field', () => {
    expect(field.validate(42)).toEqual(42)
  })
})

test('types', () => {
  type Spec = TypeHint<typeof field>
  expectType<Spec, number>(true)
})
