import { declareField } from '../registry'
import { Json } from '../Json'
import { withParentFields } from '../utils'
import { FieldWithRegExp, FieldWithStringInputSupport } from './segmentField'

class BooleanField implements FieldWithStringInputSupport<boolean> {
  getFieldWithRegExp(): BooleanFieldWithRegExp {
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

class BooleanFieldWithRegExp extends BooleanField implements FieldWithRegExp<boolean> {

  asString(value: boolean) {
    return value.toString()
  }
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
