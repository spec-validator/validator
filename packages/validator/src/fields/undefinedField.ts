import { declareField, Field } from '../core'


export default declareField('@spec-validator/fields.UndefinedField', (
): Field<any> => ({
  validate: (): undefined => undefined,
  serialize: () => undefined,
}))
