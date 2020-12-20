import { numberField, stringField } from './fields'

import { $, FieldDeclaration, FieldPair } from './registry'

const pair: FieldPair<FieldDeclaration> = $(stringField, (field) => 42)

const pair2 = $(numberField, (field) => 42)

const normalRegistryPairs = [
  pair,
  pair2
] as const

describe('createRegistry', () => {
  it('')
})
