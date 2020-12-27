import { omit } from './utils'

test('omit', () => {
  const foo = omit({
    key: 11,
    key2: 22
  }, ['key2'])
  expect(foo).toEqual({key: 11})

})
