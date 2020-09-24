import { TypeHint } from '../core';

import stringField from './stringField';

import numberField from './numberField';

import segmentChainField, { segment as s, SegmentChainSpec } from './segmentChainField';

test('basics', () => {
  type FF = {
    username: string,
    uid: number,
    suid: string
  }

  const segments: SegmentChainSpec<FF> = [
    '/',
    s('username', stringField()),
    '/todos/',
    s('uid', numberField()),
    '/subtodos',
    s('suid', numberField()),
  ]

  const spec = {
    value: segmentChainField(segments)
  }

  type foo = TypeHint<typeof spec>

})
