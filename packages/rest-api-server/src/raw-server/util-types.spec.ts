import { expectType } from '@validator/validator/TypeTestUtils.test'
import { Optional } from '@validator/validator/utils'
import { KeysOfType, RequiredKeys, WithoutOptional } from './util-types'

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

test('RequiredKeys', () => {
  type Input = {
    nullable1?: string,
    nullable2?: string,
    nonNullable1: string,
    nonNullable2: string
  }
  type Keys = RequiredKeys<Input>

  expectType<Keys>('nonNullable1' as 'nonNullable1' | 'nonNullable2')
  expectType<Keys>('nonNullable2' as 'nonNullable1' | 'nonNullable2')
})

test('WithoutOptional', () => {
  type Clean = WithoutOptional<{
    nullable1?: string,
    nullable2: Optional<string>
    nonNullable: string
  }>

  expectType<Clean>({nonNullable: 'value'})
})
