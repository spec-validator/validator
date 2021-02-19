import { firstHeader, getBaseUrl } from './handler'

describe('firstHeader', () => {
  it('undefined', () => {
    expect(firstHeader(undefined)).toEqual(undefined)
  })

  it('string', () => {
    expect(firstHeader('one')).toEqual('one')
  })

  it('array', () => {
    expect(firstHeader(['one'])).toEqual('one')
  })
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

  it('loads default url if no config is provided', () => {
    expect(getBaseUrl()).toEqual('http://localhost:8000')
  })

})
