import { firstHeader } from './handler'

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
