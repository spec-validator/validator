import stringField from './stringField';

import {
  testValidateSegmentChainError,
  testValidateSegmentChainOK,
  testValidateSpecError,
  testValidateSpecOk
} from '../TestUtils.spec';

const field = stringField({
  regex: /[A-Z]+/
})

describe('spec', () => {

  it('allows valid choices to get throw', () => {
    testValidateSpecOk(field, 'AA', 'AA');
  });

  it('prevents invalid choices from getting through', () => {
    testValidateSpecError(field, false, 'Not a string');
    testValidateSpecError(field, '12', 'Doesn\'t match a regex');
  });

})

describe('segmentChain', () => {

  it('allows valid choices to get throw', () => {
    testValidateSegmentChainOK(field, 'AA', 'AA');
  });

  it('prevents invalid choices from getting through', () => {
    testValidateSegmentChainError(field, '12', 'Didn\'t match');
  });

})
