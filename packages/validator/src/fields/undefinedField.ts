import { declareField, Field } from '../core'

export type UndefinedField = Field<undefined>

export default declareField('@spec-validator/validator/fields/undefinedField', (
): UndefinedField => ({
  validate: (): undefined => undefined,
  serialize: () => undefined,
}))
