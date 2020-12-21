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
  $(objectField, (field, requestRepresentation) => Object.fromEntries(
    Object.entries(field.objectSpec).map(
      ([key, subfield]) => [key, requestRepresentation(subfield)]
    )
  ))
]

describe('createRegistry', () => {
  it('correctly returns a representation of a schema of a', () => {
    const registry = createRegistry(normalRegistryPairs)

  })
})
