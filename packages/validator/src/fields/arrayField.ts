import { Field, withErrorDecoration } from '../core'
import { OfType } from '../registry'
import { Json } from '../Json'

interface ArrayField<T> extends Field<T[]> {
  readonly itemField: Field<T>,
}

export const field = <
  Type extends string,
  Params extends any[],
  FieldType extends Field<unknown>,
  Constructor extends (...params: Params) => FieldType
> (
    type: Type,
    constructor: Constructor
  ): Constructor & OfType<Type>  => {
  const wrapper = (...params: any[]) => {
    const result = (constructor as any)(...params)
    result.type = type
    return result
  }
  wrapper.type = type
  return wrapper as any
}

const arrayField = field('@validator/fields.ArrayField', <T>(itemField: Field<T>): ArrayField<T> => ({
  itemField,
  validate: (value: any): T[] => {
    if (!Array.isArray(value)) {
      throw 'Not an array'
    }
    return value.map(
      (it, index) => withErrorDecoration(index, () => itemField.validate(it))
    )
  },
  serialize: (deserialized: T[]): Json =>
    deserialized.map(
      (it, index) => withErrorDecoration(index, () => itemField.serialize(it) as unknown as Json)
    )
}))
