/* eslint-disable no-shadow */

import { SpecUnion, Field } from './core'
import { getFieldForSpec } from './interface'
export type OfType<Type extends string> = {
  readonly type: Type
}

export type FieldDeclaration<
  Type extends string = string,
  Params extends any[] = any[],
  FieldType extends Field<unknown> = Field<unknown>,
  Constructor extends (...params: Params) => FieldType = (...params: Params) => FieldType
> = Constructor & OfType<Type>

export const field = <
  Type extends string,
  Params extends any[],
  FieldType extends Field<unknown>,
  Constructor extends (...params: Params) => FieldType
> (
    type: Type,
    constructor: Constructor
  ): (Constructor) & OfType<Type>  => {
  const wrapper = (...params: any[]) => {
    const result = (constructor as any)(...params)
    result.type = type
    return result
  }
  wrapper.type = type
  return wrapper as (Constructor) & OfType<Type>
}

type RequestRepresentation =
  (field: SpecUnion<unknown>) => any

type ProvideRepresentation<
  RepresentationType,
  FieldType extends Field<unknown> = Field<unknown>,
  Type extends string = string,
> =
  (
    field: FieldType,
    provideRepresentation: (
      field: FieldType & OfType<Type>,
      requestRepresentation: RepresentationType
    ) => RepresentationType
  ) => RepresentationType

export type FieldPair<
  Declaration extends FieldDeclaration = FieldDeclaration
> =
  [Declaration, ProvideRepresentation<ReturnType<Declaration>>]

export const registryDeclaration = <
  Declaration extends FieldDeclaration<string, any[], Field<unknown>>
>(
    fieldDeclaration: Declaration,
    provideRepresentation: (
      field: ReturnType<Declaration>,
      requestRepresentation: RequestRepresentation
    ) => any
  ): FieldPair<FieldDeclaration<string, any[], Field<unknown>>> => [
    fieldDeclaration,
    provideRepresentation as any,
  ]

const withNoDuplicates = <T extends any[]>(items: T, by: (item: T[number]) => string): T => {
  const processed = new Set()
  items.forEach((item) => {
    if (processed.has(by(item))) {
      throw `Found duplicate of type declaration '${by(item)}'`
    }
    processed.add(by(item))
  })
  return items
}

const getValue = <V> (mapping: Record<string, V>, rawTypeRef: any, type?: string): V => {
  if (!type) {
    throw `Fields without 'type' are not supported: ${Object.keys(rawTypeRef)}`
  }
  const value = mapping[type]
  if (value === undefined) {
    throw `Could not find field of type '${type}'`
  }
  return value
}

export type GetRepresentation = (field: SpecUnion<unknown>) => any

/**
 * This is a generic solution to provide a virtually unlimited number
 * of serializable representations of the field classes.
 *
 * The solution is based on aspect-oriented programming model in
 * a conjunction with a registry design pattern.
 *
 * The registry maps a field creator of a specific type with
 * a function that has to provide a representation of the field.
 */
const createRegistry = (
  pairs: FieldPair[]
): GetRepresentation => {
  const mapping = Object.fromEntries(
    withNoDuplicates(pairs, (pair) => pair[0].type).map(([key, value]) => ([key.type, value]))
  )
  const getRepresentation: GetRepresentation =
    (it) => {
      const itF = getFieldForSpec(it)
      return getValue(mapping, itF, (itF as unknown as OfType<string>).type)(itF, getRepresentation)
    }
  return getRepresentation
}

export default createRegistry
