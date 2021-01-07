import { Field } from '../core'
import { field } from '../registry'
import { Any } from '../util-types'

export interface WithDefault<T extends Any> extends Field<T> {
  readonly innerField: Field<T>,
  readonly defaultValue: T
}

export default field('@validator/fields.WithDefault', <T extends Any> (
  innerField: Field<T>,
  defaultValue: T
): WithDefault<T> => ({
    innerField,
    defaultValue,
    validate: (value: any): T => {
      if (value === undefined) {
        value = defaultValue
      }
      return innerField.validate(value)
    },
    serialize: (deserialized: T) => innerField.serialize(deserialized),
  }))
