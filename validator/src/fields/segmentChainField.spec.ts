import { TypeHint } from '../core';

import stringField from './stringField';

import segmentChainField, { segment as s } from './segmentChainField';

test('basics', () => {
  const spec = {
    value: segmentChainField([
      '/',
      s('username', stringField()),
      '/todos/',
      s('uid', stringField()),
      '/subtodos',
      s('suid', stringField()),
    ])
  }

  type foo = TypeHint<typeof spec>

})
