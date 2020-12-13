import { Field } from '../core'
import { Json } from '../Json'
import { WithRegExp, WithStringInputSupport } from '../WithStringInputSupport'

const FieldSymbol = Symbol('@validator/fields.StringField')

class StringField implements Field<string>, WithStringInputSupport, WithRegExp {
  private regexV?: RegExp;

  constructor(regex?: RegExp) {
    this.regexV = regex
  }
  type = FieldSymbol
  getFieldWithRegExp(): StringField & WithRegExp {
    return this
  }
  get regex() {
    return this?.regexV || /.*/
  }
  validate(value: any): string {
    if (typeof value !== 'string') {
      throw 'Not a string'
    }
    if (this.regexV) {
      const match = value.match(`^${this.regexV.source}$`)
      if (!match) {
        throw 'Doesn\'t match a regex'
      }
    }
    return value
  }
  serialize(deserialized: string): Json {
    return deserialized
  }
}

const stringField = (regex?: RegExp): StringField => new StringField(regex)

stringField.type = FieldSymbol

export default stringField
