import { Field } from '../core'
import { field } from '../registry'


export default field('@validator/fields.UndefinedField', (
): Field<any> => ({
  validate: (): undefined => undefined,
  serialize: () => undefined,
}))
