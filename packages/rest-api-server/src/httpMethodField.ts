import { Field } from '../../validator/src/core'
import { OfType, declareField } from '../../validator/src/registry'

class HttpMethodField<Method extends string> implements Field<Method> {
  constructor(readonly method: Method) {}

  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  validate(_: any): Method {
    return this.method
  }
  serialize(_: Method): string {
    return this.method
  }
}

const t = '@validator/rest.HttpMethodField' as const
type Type = OfType<typeof t>
export default declareField(t, HttpMethodField) as
  (<Choice extends string> (
    choice: Choice
  ) => HttpMethodField<string> & Type) & Type
