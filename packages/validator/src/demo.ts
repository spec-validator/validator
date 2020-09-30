import { TypeHint, validate } from './core'
import { objectField, numberField } from './fields'

const spec = {
  field: objectField({
    num: numberField(),
    subField: objectField({
      subSubField: numberField()
    })
  }),
}
type Spec = TypeHint<typeof spec>

const valid = {
  field: {
    num: 42,
    subField: {
      subSubField: 11
    }
  }
}

console.log(validate(spec, valid));

console.log(validate(spec, 'INVALID'));
