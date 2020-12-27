import { declareField } from '../registry'
import { Json } from '../Json'
import { withParentFields } from '../utils'
import { FieldWithRegExp, FieldWithStringInputSupport } from './segmentField'

class NumberField implements FieldWithStringInputSupport<number> {
  constructor(readonly params?: {
    canBeFloat?: boolean
  }) {}

  getFieldWithRegExp(): NumberFieldWithRegExp {
    return withParentFields(this, new NumberFieldWithRegExp(this.params), ['type'])
  }

  validate(value: any): number {
    if (typeof value !== 'number') {
      throw 'Not a number'
    }
    if (!this.params?.canBeFloat && value !== Math.floor(value)) {
      throw 'Not an int'
    }
    return value
  }
  serialize(deserialized: number): Json {
    return deserialized
  }
}

class NumberFieldWithRegExp extends NumberField implements FieldWithRegExp<number> {

  get regex() {
    const parts: string[] = []
    parts.push('-?')
    parts.push('\\d+')
    if (this.params?.canBeFloat) {
      parts.push('(\\.\\d+)?')
    }

    return RegExp(parts.join(''))
  }

  asString(value: number) {
    return value.toString()
  }

  validate(value: any) {
    return super.validate(Number.parseFloat(value))
  }

}

export default declareField('@validator/fields.NumberField', NumberField)
