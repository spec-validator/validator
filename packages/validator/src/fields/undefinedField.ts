import { declareField, Field } from '../core'


export default declareField('@spec-validator/validator/fields/undefinedField', (
): Field<any> => ({
  validate: (): undefined => undefined,
  serialize: () => undefined,
}))
