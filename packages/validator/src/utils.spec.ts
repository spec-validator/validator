import { omit, pick, resolveValues } from './utils'

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


test('resolveValues', () => {
  expect(resolveValues({
    key: Promise.resolve('promised'),
    key2: 'exact'
  })).toEqual(Promise.resolve({
    key: 'promised',
    key2: 'exact'
  }))
})
