import { numberField, stringField, objectField } from './fields'

import createRegistry, { $, Registry } from './registry'

const normalRegistryPairs: Registry = [
  $(stringField, (field) => ({
    regexp: field.regex.source,
    type: 'string'
  })),
  $(numberField, (field) => ({
    canBeFloat: field.params?.canBeFloat || false,
    type: 'number'
  })),
  $(objectField, (field, getRepresentation) => Object.fromEntries(
    Object.entries(field.objectSpec).map(([key, field]) => [key, getRepresentation(field)])
  )
]

describe('createRegistry', () => {
  it('correctly returns a representation of a schema of a', () => {
    const registry = createRegistry(normalRegistryPairs)

  })
})
