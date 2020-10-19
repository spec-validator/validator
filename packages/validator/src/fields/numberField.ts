import { Field } from '../core'
import { Json } from '../Json'
import { WithRegExp, WithStringInputSupport } from '../WithStringInputSupport'

type Params = {
  canBeFloat?: boolean
}

class NumberField implements Field<number>, WithStringInputSupport {
  protected params?: Params

  constructor(params?: Params) {
    this.params = params
  }
  getFieldWithRegExp(): Field<unknown> & WithRegExp {
    return new NumberFieldWithRegExp(this.params)
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
  getParams() {
    return this.params
  }
}

class NumberFieldWithRegExp extends NumberField implements WithRegExp {

  regex() {
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

const numberField = (params?: Params): NumberField => new NumberField(params)

export default numberField
