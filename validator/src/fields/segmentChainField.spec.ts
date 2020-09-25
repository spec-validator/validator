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

  const valid = segmentSpec.validate('/path/to/the/moon')

});
