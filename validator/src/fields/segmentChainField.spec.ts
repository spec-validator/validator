import { TypeHint } from '../core';

import stringField from './stringField';

import numberField from './numberField';

import segmentChainField, { segment as s } from './segmentChainField';

test('basics', () => {
  const spec = {
    value: segmentChainField([
      '/',
      s('username', stringField()),
      '/todos/',
      s('uid', numberField()),
      '/subtodos',
      s('suid', numberField()),
    ])
  }

  type foo = TypeHint<typeof spec>

})
