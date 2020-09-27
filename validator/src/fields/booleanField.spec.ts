import booleanField from './booleanField';

const field = booleanField()

describe('spec', () => {

  it('allows valid choices to get throw', () => {
    [true, 1, 'true'].forEach(it => {
      expect(field.getFieldWithRegExp().validate(it)).toEqual(true);
    });

    [false, 0, 'false'].forEach(it => {
      expect(field.getFieldWithRegExp().validate(it)).toEqual(false);
    });
  });

  it('prevents invalid choices from getting through', () => {
    // TODO
  });

})

describe('segmentChain', () => {

  it('allows valid choices to get throw', () => {
    // TODO
  });

  it('prevents invalid choices from getting through', () => {
    // TODO
  });

})

