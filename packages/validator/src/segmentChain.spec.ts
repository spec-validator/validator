import stringField from './fields/stringField'

import numberField from './fields/numberField'

import { $, Segment } from './segmentChain'
import { expectType } from './TypeTestUtils.test'
import { TypeHint } from './core'

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
    expectType<Seg, Segment<undefined>>(true)
    type Props = TypeHint<Seg>
    expectType<Props, undefined>(true)
  })

  it('with unparametrized segment', () => {
    const path = $._('foo')
    type Seg = typeof path
    expectType<Seg, Segment<undefined>>(true)
  })

  it('with parametrized segment', () => {
    const path = $._('foo')._('key', numberField())
    type Seg = typeof path
    expectType<Seg, Segment<{
      key: number
    }>>(true)
  })
})
