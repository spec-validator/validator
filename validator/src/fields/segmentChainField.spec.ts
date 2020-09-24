import { TypeHint } from '../core';

import stringField from './stringField';

import numberField from './numberField';

import segmentChainField from './segmentChainField';

test('basics', () => {
  const spec = {
    value: segmentChainField([
      '/',
      ['username', stringField()],
      '/todos/',
      ['uid', numberField()],
      '/subtodos',
      ['suid', numberField()],
    ])
  }

  type foo = TypeHint<typeof spec>

})
