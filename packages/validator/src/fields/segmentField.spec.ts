import stringField from './stringField'

import numberField from './numberField'

import $ from './segmentField'
import { expectType } from '../TypeTestUtils.test'
import { TypeHint } from '../core'
import { testValidateSpecOk } from '../TestUtils.test'


describe('field', () => {

  it('validates plain string segment', () => {
    testValidateSpecOk($._('/items'), '/items', {})
  })

  it('toString', () => {
    expect($
      ._('/')
      ._('username', stringField())
      .toString()
    ).toEqual('^/(?<username>.*)$')
  })

  it('validates the input correctly', () => {
    const segmentSpec = $
      ._('/')
      ._('username', stringField())
      ._('/todos/')
      ._('uid', numberField())
      ._('/subtodos/')
      ._('suid', numberField())

    testValidateSpecOk(segmentSpec, '/john-sick/todos/11/subtodos/42', {
      username: 'john-sick',
      uid: 11,
      suid: 42,
    })
  })

  it('leverages regexp cache (coverage) when validateing twice', () => {
    const segmentSpec = $
      ._('/')
      ._('username', stringField())

    testValidateSpecOk(segmentSpec, '/john-sick', { 'username': 'john-sick'})
    testValidateSpecOk(segmentSpec, '/john-woo', { 'username': 'john-woo'})
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
