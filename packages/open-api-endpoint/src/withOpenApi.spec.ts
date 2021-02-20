import withOpenApi, { getBaseUrl } from './withOpenApi'

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


describe('getBaseUrl', () => {

  beforeEach(() => {
    delete process.env.REST_API_BASE_URL
  })

  afterEach(() => {
    delete process.env.REST_API_BASE_URL
  })

  it('loads from REST_API_BASE_URL env if it is set', () => {
    process.env.REST_API_BASE_URL = 'base-from-env'
    expect(getBaseUrl('configure')).toEqual('base-from-env')
  })

  it('loads configured one if REST_API_BASE_URL is not set', () => {
    expect(getBaseUrl('configured')).toEqual('configured')
  })

})
