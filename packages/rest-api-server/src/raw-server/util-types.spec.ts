import { expectType } from '@validator/validator/TypeTestUtils.test'
import { AllNonNullKeyTypes, KeysOfType, RequiredKeys, WithoutOptional } from './util-types'

type Input = {
  boolNUll?: boolean,
  boolNonNull: boolean,
  numNull?: number,
  numNonNull: number
}

describe('KeysOfType', () => {

  it('filters type or undefined clause', () => {
    type Keys1 = KeysOfType<Input, number | undefined>
    expectType<Keys1>('numNull')
    expectType<Keys1>('numNonNull')
  })

  it('filters only type clause', () => {
    type Keys1 = KeysOfType<Input, number | boolean>
    expectType<Keys1>('numNonNull')
    expectType<Keys1>('boolNonNull')
  })

})

test('AllNonNullKeyTypes', () => {
  type KeyTypes = AllNonNullKeyTypes<Input>
  expect<KeyTypes>({} as number | boolean)
})

test('RequiredKeys', () => {
  type Keys = RequiredKeys<Input>

  expectType<Keys>('boolNonNull')
  expectType<Keys>('numNonNull')
})

test('WithoutOptional', () => {
  type Clean = WithoutOptional<Input>

  expectType<Clean>({boolNonNull: true, numNonNull: 42})
})
