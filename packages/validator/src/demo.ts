import { TypeHint, validate } from './core'
import { objectField, numberField, stringField } from './fields'
import { root } from './segmentChain'

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

const segmentSpec = root
  ._('/')
  ._('username', stringField())
  ._('/todos/')
  ._('uid', numberField())
  ._('/subtodos/')
  ._('suid', numberField());

console.log('****')

console.log(segmentSpec.match('/john-sick/todos/11/subtodos/42'))

console.log(segmentSpec.match('/bla'))
