import booleanField from './booleanField'
import {
  testValidateSegmentChainError,
  testValidateSegmentChainOK,
  testValidateSpecError,
  testValidateSpecOk
} from './TestUtils.spec'

const field = booleanField()

describe('spec', () => {

  it('allows valid choices to get throw', () => {
    testValidateSpecOk(field, true, true)
    testValidateSpecOk(field, false, false)
  })

  it('prevents invalid choices from getting through', () => {
    testValidateSpecError(field, 'foo', 'Not a boolean')
  })

})

describe('segmentChain', () => {

  it('allows valid choices to get throw', () => {
    ['1', 'true'].forEach(it => testValidateSegmentChainOK(field, it, true));
    ['0', 'false'].forEach(it => testValidateSegmentChainOK(field, it, false))
  })

  it('prevents invalid choices from getting through', () => {
    testValidateSegmentChainError(field, 'foo', 'Didn\'t match')
  })

})

