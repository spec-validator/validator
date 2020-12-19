import { Field } from '.'

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


type FieldPair<
  RepresentationFormat,
  FieldType extends Field<unknown> = Field<unknown>,
> =
  [(() => FieldType) & OfType<string>, (field: FieldType) => RepresentationFormat]

export type Registy<RepresentationFormat> = [FieldPair<RepresentationFormat>]

export default <RepresentationFormat>(
  ...registries: Registy<RepresentationFormat>[]
) => (specs: SpecUnion<Any>) => {
  const mapping: Record<any, (field: Field<unknown>) => RepresentationFormat> = {}
  registries.forEach(registry => {
    registry.forEach(([key, value]) => {
      if (mapping[key.type]) {
        throw `Field '${key.type}' is already registered`
      }
      mapping[key.type] = value
    })
  })
}
