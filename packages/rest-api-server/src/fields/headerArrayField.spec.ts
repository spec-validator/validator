import { expectType } from '@spec-validator/test-utils/expectType'
import { TypeHint } from '@spec-validator/validator'
import { FieldWithRegExp, FieldWithStringInputSupport } from '@spec-validator/validator/fields/segmentField'
import { testValidateSpecError, testValidateSpecOk } from '@spec-validator/validator/TestUtils.test'

import arrayField from './headerArrayField'

const sampleField = (): FieldWithStringInputSupport<true> => {
  const result = {
    regex: /true/,
    validate: (it: any): true => {
      if (it === 'true') {
        return true
      }
      throw 'Boom!'
    },
    serialize: (it: true) => it.toString(),
  } as unknown as FieldWithStringInputSupport<true> & FieldWithRegExp<true>
  result.getFieldWithRegExp = () => result
  return result
}

const field = arrayField(sampleField())

describe('field', () => {

  it('valid', () => {
    testValidateSpecOk(field, 'true', [true])
  })

  it('not a string', () => {
    testValidateSpecError(field, true, 'Not a string')
  })

  it('invalid item', () => {
    testValidateSpecError(field, 'true, true, false', {'inner': 'Boom!', 'path': [2]})
  })
})

test('types', () => {
  type Spec = TypeHint<typeof field>

  expectType<Spec, true[]>(true)
})
