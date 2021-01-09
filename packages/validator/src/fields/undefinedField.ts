import { Field } from '../core'
import { declareField } from '../registry'


export default declareField('@validator/fields.UndefinedField', (
): Field<any> => ({
  validate: (): undefined => undefined,
  serialize: () => undefined,
}))
