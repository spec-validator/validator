import stringField from './stringField';

import numberField from './numberField';

import { root } from './segmentChainField';

test('basics', () => {
  const segmentSpec = root
    ._('/')
    ._('username', stringField())
    ._('/todos/')
    ._('uid', numberField())
    ._('/subtodos/')
    ._('suid', numberField());

  const valid = segmentSpec.match('/john-sick/todos/11/subtodos/42')

  expect(valid).toEqual({
    username: 'john-sick',
    uid: 11,
    suid: 42
  })
});
