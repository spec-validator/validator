import { validate, TypeHint, serialize } from '.'

test('imports', () => {
  expect(validate).toBeTruthy()
  expect(serialize).toBeTruthy()

  type T = TypeHint<typeof undefined>
  const t: T = undefined
  expect(t).toEqual(undefined)
})
