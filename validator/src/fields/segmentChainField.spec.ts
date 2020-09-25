import stringField from './stringField';

import numberField from './numberField';

import { root } from './segmentChainField';

test('basics', () => {
  const spec = root
    ._<'username', string>('username', stringField())
    ._<'uid', number>('uid', numberField())
    ._<'suid', number>('suid', numberField());
  }
});
