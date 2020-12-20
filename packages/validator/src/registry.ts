import { Field } from '.'
import { Json } from './Json'

type OfType<Type extends string> = {
  readonly type: Type
}

export const declareField = <
  Type extends string,
  Params extends any[],
  FieldType extends Field<unknown>
> (
    type: Type,
    constructor: new (...params: Params) => FieldType
  ): ((...params: Readonly<Params>) => FieldType & OfType<Type>) & OfType<Type> => {
  const wrapper = (...params: Params): FieldType & OfType<Type> => {
    const result = new constructor(...params) as FieldType & { type: Type }
    result.type = type
    return result
  }
  wrapper.type = type
  return wrapper
}

type GetRepresentation<Type extends string=string> =
  (
    field: Field<unknown> & OfType<Type>,
    getRepresentation: GetRepresentation
  ) => Json

type FieldPair<
  FieldType extends Field<unknown> = Field<unknown>,
  Type extends string = string
> =
  [(() => FieldType) & OfType<Type>, GetRepresentation<Type>]

const ensureNoDuplicates = (items: unknown[]) => {
  const processed = new Set()
  items.forEach((item) => {
    if (processed.has(item)) {
      throw `Found duplicate of ${item}`
    }
    processed.add(item)
  })
}

/**
 * This is a generic solution to provide a virtually inlimited number
 * of serializable representations of the field classes.
 *
 * The solution is based on aspect-oriented programming model in
 * a conjunction with a registry design pattern.
 *
 * The registry maps a field creator of a specific type with
 * a function that has to provide a representation of the field.
 *
 * Note: each field subclass should be registered separately
 * including the `WithRegExp` ones.
 */
const createRegistry = (
  ...registry: FieldPair[]
): <Type extends string>(field: Field<unknown> & OfType<Type>) => Json => {
  ensureNoDuplicates(registry.map((item) => item[0].type))
  const mapping: Record<any, GetRepresentation> = Object.fromEntries(
    registry.map(([key, value]) => [key.type, value])
  )
  const getRepresentation = <Key extends string>(field: Field<unknown> & OfType<Key>): Json => {
    const fieldMapper = mapping[field.type]
    if (!fieldMapper) {
      throw `Field type '${field.type}' is not registered`
    }
    return fieldMapper(field, getRepresentation)
  }
  return getRepresentation
}

export default createRegistry
