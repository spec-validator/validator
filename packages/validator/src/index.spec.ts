import { Field, validate, TypeHint, Json, serialize, $ } from '.'

import { expectType } from './TypeTestUtils.test'

const sampleField = (): Field<'sample'> => ({
  validate: (): 'sample'  => 'sample',
  serialize: (): Json  => 'sample'
})

test('imports', () => {
  expect($).toBeTruthy()
  expect(validate).toBeTruthy()
  expect(serialize).toBeTruthy()

  const schema = {
    key: sampleField()
  }

  type Schema = TypeHint<typeof schema>
  expectType<Schema, {
    key: 'sample'
  }>(true)
})
