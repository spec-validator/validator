import { omit, pick } from './utils'

test('omit', () => {
  expect(omit({
    key: 11,
    key2: 22
  }, ['key2'])).toEqual({key: 11})

})

test('pick', () => {
  expect(pick({
    key: 11,
    key2: 22
  }, ['key2'])).toEqual({key2: 22})
})
