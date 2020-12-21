import { Field } from '.'
import { Json } from './Json'

export type OfType<Type extends string> = {
  readonly type: Type
}

export type FieldDeclaration<
  Type extends string = string,
  Params extends any[] = any[],
  FieldType extends Field<unknown> = Field<unknown>
> =
  ((...params: Readonly<Params>) => FieldType & OfType<Type>) & OfType<Type>

export const declareField = <
  Type extends string,
  Params extends any[],
  FieldType extends Field<unknown>
> (
    type: Type,
    constructor: new (...params: Params) => FieldType
  ): FieldDeclaration<Type, Params, FieldType> => {
  const wrapper = (...params: Params): FieldType & OfType<Type> => {
    const result = new constructor(...params) as FieldType & { type: Type }
    result.type = type
    return result
  }
  wrapper.type = type
  return wrapper
}

type RequestRepresentation =
  (field: Field<unknown>) => Json

type ProvideRepresentation<
  FieldType extends Field<unknown> = Field<unknown>,
  Type extends string = string
> =
  (
    field: FieldType,
    provideRepresentation: (
      field: FieldType & OfType<Type>,
      requestRepresentation: RequestRepresentation
    ) => Json
  ) => Json

type FieldPair<
  Declaration extends FieldDeclaration = FieldDeclaration
> =
  [Declaration, ProvideRepresentation<ReturnType<Declaration>>]

export const $ = <
  Declaration extends FieldDeclaration<string, any[], Field<unknown>>
>(
    fieldDeclaration: Declaration,
    provideRepresentation: (
      field: ReturnType<Declaration>,
      requestRepresentation: RequestRepresentation
    ) => Json
  ): FieldPair<FieldDeclaration<string, any[], Field<unknown>>> => [
    fieldDeclaration,
    provideRepresentation as RequestRepresentation
  ]

export type Registry = FieldPair[]

const withNoDuplicates = <T extends any[]>(items: T): T => {
  const processed = new Set()
  items.forEach((item) => {
    if (processed.has(item)) {
      throw `Found duplicate of ${item}`
    }
    processed.add(item)
  })
  return items
}

const getValue = <V> (mapping: Record<string, V>, key: string): V => {
  const value = mapping[key]
  if (value === undefined) {
    throw `Could not find element with key '${key}'`
  }
  return value
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
  pairs: FieldPair[]
): <Type extends string>(field: Field<unknown> & OfType<Type>) => Json => {
  const mapping = Object.fromEntries(
    withNoDuplicates(pairs).map(([key, value]) => ([key.type, value]))
  )
  const getRepresentation = <Type extends string>(
    field: Field<unknown> & OfType<Type>
  ): Json => getValue(mapping, field.type)(field, getRepresentation)
  return getRepresentation
}

export default createRegistry
