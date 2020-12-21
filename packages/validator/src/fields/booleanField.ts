import { Field } from '../core'
import { declareField } from '../registry'
import { Json } from '../Json'
import { Any } from '../util-types'
import { WithRegExp, WithStringInputSupport } from '../WithStringInputSupport'
import { withParentFields } from '../utils'

class BooleanField implements Field<boolean>, WithStringInputSupport {
  getFieldWithRegExp(): Field<Any> & WithRegExp {
    return withParentFields(this, new BooleanFieldWithRegExp(), ['type'])
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
}

class BooleanFieldWithRegExp extends BooleanField implements WithRegExp {

  get regex() {
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

export default declareField('@validator/fields.BooleanField', BooleanField)
