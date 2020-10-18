import stringField from './fields/stringField'

import numberField from './fields/numberField'

import { $ } from './segmentChain'

test('basics', () => {
  const segmentSpec = $
    ._('/')
    ._('username', stringField())
    ._('/todos/')
    ._('uid', numberField())
    ._('/subtodos/')
    ._('suid', numberField())

  const valid = segmentSpec.match('/john-sick/todos/11/subtodos/42')

  expect(valid).toEqual({
    username: 'john-sick',
    uid: 11,
    suid: 42
  })
})
