import entrypoint from '.'

test('entrypoint', () => {
  expect(entrypoint('title')).toEqual('Return title')
})
