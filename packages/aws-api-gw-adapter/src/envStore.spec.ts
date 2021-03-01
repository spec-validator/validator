import createUnboundEnvStore from './envStore'

const createStore = createUnboundEnvStore('KEY_ONE')

const store = createStore()

beforeEach(() => {
  delete process.env.KEY_ONE
})

test('getting unset env should thrown an error', () => {
  expect(() => store.KEY_ONE).toThrow('Missing env KEY_ONE')
})

test('setting and getting and env variable should work in synergy', () => {
  store.KEY_ONE = 'one'
  expect(store.KEY_ONE).toEqual('one')
  expect(process.env.KEY_ONE).toEqual('one')
})
