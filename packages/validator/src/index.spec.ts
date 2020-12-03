import { Field, validate, TypeHint, Json, serialize, getParams, $ } from '.'

import { expectType } from './TypeTestUtils.test'

class SampleField implements Field<'sample'> {
  validate(_: any): 'sample' {
    return 'sample'
  }
  serialize(_: 'sample'): Json {
    return 'sample'
  }
  getParams() {
    return {}
  }
}

test('imports', () => {
  expect($).toBeTruthy()
  expect(validate).toBeTruthy()
  expect(serialize).toBeTruthy()
  expect(getParams).toBeTruthy()

  const schema = {
    key: new SampleField()
  }

  type Schema = TypeHint<typeof schema>
  expectType<Schema, {
    key: 'sample'
  }>(true)
})
