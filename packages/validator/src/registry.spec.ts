import { numberField, stringField, objectField, booleanField } from './fields'
import createRegistry, { $, FieldPair } from './registry'

const normalRegistryPairs: FieldPair[] = [
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
  it('correctly returns a representation of a schema with known field', () => {
    const registry = createRegistry(normalRegistryPairs)
    const schema = objectField({
      title: stringField(),
      page: objectField({
        subtitle: stringField(),
        pageCount: numberField()
      })
    })
    expect(registry(schema)).toMatchSnapshot()
  })

  it('throws an error if a duplicate type is registered', () => {
    expect(() => createRegistry([...normalRegistryPairs, $(stringField, () => undefined)]))
      .toThrow(`Found duplicate of type declaration '${stringField.type}'`)
  })

  it('throws an error if field type is unknown', () => {
    const registry = createRegistry(normalRegistryPairs)
    const schema = objectField({
      flag: booleanField()
    })
    expect(() => registry(schema))
      .toThrow(`Could not find field of type '${booleanField.type}'`)
  })
})
