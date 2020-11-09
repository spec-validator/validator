import stringField from './fields/stringField'

import numberField from './fields/numberField'

import { $, Segment, SegmentTypeHint } from './segmentChain'
import { expectType } from './TypeTestUtils.test'

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
    suid: 42,
  })
})

describe('type', () => {

  it('root', () => {
    type Seg = typeof $
    expectType<Seg, Segment<unknown>>(true)
    type Props = SegmentTypeHint<Seg>
    expectType<Props, undefined>(true)
  })

  it('with unparametrized segment', () => {
    const path = $._('foo')
    type Seg = typeof path
    expectType<Seg, Segment<unknown>>(true)
  })
})
