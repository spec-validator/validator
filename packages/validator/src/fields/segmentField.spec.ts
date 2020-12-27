import stringField from './stringField'

import numberField from './numberField'

import $ from './segmentField'
import { expectType } from '../TypeTestUtils.test'
import { TypeHint } from '../core'


describe('basics', () => {
  it('validates the input correctly', () => {
    const segmentSpec = $
      ._('/')
      ._('username', stringField())
      ._('/todos/')
      ._('uid', numberField())
      ._('/subtodos/')
      ._('suid', numberField())

    const valid = segmentSpec.validate('/john-sick/todos/11/subtodos/42')

    expect(valid).toEqual({
      username: 'john-sick',
      uid: 11,
      suid: 42,
    })

  })

  it('leverages regexp cache (coverage) when validateing twice', () => {
    const segmentSpec = $
      ._('/')
      ._('username', stringField())

    segmentSpec.validate('/john-sick')
    segmentSpec.validate('/john-woo')
  })

  it('serializes an object back into a string', () => {
    const segmentSpec = $
      ._('/')
      ._('username', stringField())
      ._('/todos/')
      ._('uid', numberField())
      ._('/subtodos/')
      ._('suid', numberField())

    const valid = segmentSpec.serialize({
      username: 'john-sick',
      uid: 11,
      suid: 42,
    })

    expect(valid).toEqual('/john-sick/todos/11/subtodos/42')
  })

})

describe('type', () => {

  it('root', () => {
    type Props = TypeHint<typeof $>
    expectType<Props, undefined>(true)
  })

  it('with unparametrized segment', () => {
    const path = $._('foo')
    type Props = TypeHint<typeof path>
    expectType<Props, undefined>(true)
  })

  it('with parametrized segment', () => {
    const path = $._('foo')._('key', numberField())
    type Props = TypeHint<typeof path>
    expectType<Props, {
      key: number
    }>(true)
  })
})
