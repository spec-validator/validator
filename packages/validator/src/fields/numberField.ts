import { Field } from '../core'
import { declareField } from '../registry'
import { Json } from '../Json'
import { Any } from '../util-types'
import { WithRegExp, WithStringInputSupport } from '../WithStringInputSupport'
import { withParentFields } from '../utils'

class NumberField implements Field<number>, WithStringInputSupport {
  constructor(readonly params?: {
    canBeFloat?: boolean
  }) {}

  getFieldWithRegExp(): Field<Any> & WithRegExp {
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

class NumberFieldWithRegExp extends NumberField implements WithRegExp {

  get regex() {
    const parts: string[] = []
    parts.push('-?')
    parts.push('\\d+')
    if (this.params?.canBeFloat) {
      parts.push('(\\.\\d+)?')
    }

    return RegExp(parts.join(''))
  }

  validate(value: any) {
    return super.validate(Number.parseFloat(value))
  }

}

export default declareField('@validator/fields.NumberField', NumberField)
