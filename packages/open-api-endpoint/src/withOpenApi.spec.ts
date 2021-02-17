import withOpenApi from './withOpenApi'

const fullRoute = withOpenApi({})

test('routing', () => {
  expect(fullRoute).toMatchSnapshot()
})

test('schema root handler', async () => {
  expect(await fullRoute.routes[0].handler(undefined as any)).toMatchSnapshot()
})

test('schema root handler ui', async () => {
  expect(await fullRoute.routes[1].handler(undefined as any)).toMatchSnapshot()
})

test('routing with custom schema url', () => {
  expect(withOpenApi({}, '/schema')).toMatchSnapshot()
})
