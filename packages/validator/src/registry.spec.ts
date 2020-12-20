import { numberField, stringField } from './fields'

import { $ } from './registry'

const normalRegistryPairs = [
  $(stringField, (field) => 42),
  $(numberField, (field) => 42)
]

describe('createRegistry', () => {
  it('')
})
