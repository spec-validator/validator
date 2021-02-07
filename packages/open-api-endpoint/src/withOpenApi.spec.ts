import withOpenApi from './withOpenApi'

const fullRoute = withOpenApi({})

test('routing', () => {
  expect(fullRoute).toMatchSnapshot()
})

test('schema root handler', async () => {
  expect(await fullRoute.routes[0]).toMatchSnapshot()
})
