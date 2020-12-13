import { Field, validate, TypeHint, Json, serialize, $ } from '.'

import { expectType } from './TypeTestUtils.test'

class SampleField implements Field<'sample'> {
  type: symbol
  validate(_: any): 'sample' {
    return 'sample'
  }
  serialize(_: 'sample'): Json {
    return 'sample'
  }
}

test('imports', () => {
  expect($).toBeTruthy()
  expect(validate).toBeTruthy()
  expect(serialize).toBeTruthy()

  const schema = {
    key: new SampleField()
  }

  type Schema = TypeHint<typeof schema>
  expectType<Schema, {
    key: 'sample'
  }>(true)
})
