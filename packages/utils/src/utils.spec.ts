import { omit, pick, flatMap, removePrefix } from './utils'

test('omit', () => {
  expect(omit({
    key: 11,
    key2: 22,
  }, ['key2'])).toEqual({key: 11})

})

test('pick', () => {
  expect(pick({
    key: 11,
    key2: 22,
  }, ['key2'])).toEqual({key2: 22})
})

test('flatMap', () => {
  expect(flatMap([[1, 2], [3, 4]])).toEqual([1, 2, 3, 4])
})

test('removePrefix', () => {
  expect(removePrefix('abcdefg', 'xyz')).toEqual('abcdefg')
  expect(removePrefix('abcdefg', 'abc')).toEqual('defg')
})
