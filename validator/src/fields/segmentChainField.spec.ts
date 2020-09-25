import stringField from './stringField';

import numberField from './numberField';

import { root } from './segmentChainField';

test('basics', () => {
  const spec = root
    ._('username', stringField())
    ._('uid', numberField())
    ._('suid', numberField());
  }
});
