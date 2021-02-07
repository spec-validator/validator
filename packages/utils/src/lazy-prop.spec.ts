import lazyProp from './lazy-prop'

let count = 0

class TestCls {

  get prop(): number {
    return lazyProp(this, 'prop', () => {
      count += 1
      return count
    })
  }

}

beforeEach(() => {
  count = 0
})

test('cache is used', () => {
  const obj = new TestCls()
  expect(obj.prop).toEqual(1)
  expect(obj.prop).toEqual(1)
  expect(obj.prop).toEqual(1)
  // for object 2 the value was not yet cached
  const obj2 = new TestCls()
  expect(obj2.prop).toEqual(2)
})
