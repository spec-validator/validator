import { Field } from '../core'
import { Json } from '../Json'
import { Any } from '../util-types'
import { WithRegExp, WithStringInputSupport } from '../WithStringInputSupport'

const FieldSymbol = Symbol('@validator/fields.BooleanField')

class BooleanField implements Field<boolean>, WithStringInputSupport {
  type = FieldSymbol

  getFieldWithRegExp(): Field<Any> & WithRegExp {
    return new BooleanFieldWithRegExp()
  }
  validate(value: any): boolean {
    if (value !== true && value !== false) {
      throw 'Not a boolean'
    }
    return value
  }
  serialize(deserialized: boolean): Json {
    return deserialized
  }
  getParams() {
    return {
    }
  }
}

class BooleanFieldWithRegExp extends BooleanField implements WithRegExp {

  regex() {
    return /true|false|1|0/
  }

  validate(value: any): boolean {
    if (value === 'true' || value === '1') {
      value = true
    }
    if (value === 'false' || value === '0') {
      value = false
    }
    return super.validate(value)
  }

}

const booleanField = (): BooleanField => new BooleanField()

booleanField.type = FieldSymbol

export default booleanField
