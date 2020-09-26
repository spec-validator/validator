import { choiceField } from '.';
import { TypeHint } from '../core';
import { root, SegmentTypeHint } from '../segmentChain';

import { testValidateSpecOk, testValidateSpecError } from './TestUtils.spec';

const field = choiceField([1, 2, 3] as const);

const spec = {
  field
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type Spec = TypeHint<typeof spec>

describe('spec', () => {

  it('allows valid choices to get throw', () => {
    testValidateSpecOk(field, 1, 1)
  });

  it('prevents invalid choices from getting through', () => {
    testValidateSpecError(field, 4, 'Invalid choice')


  });

});

describe('segmentChain', () => {
  it('allows valid choices to get throw', () => {
    const spec = root
      ._('/')
      ._('choice', choiceField([1, 2] as const))

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    type Spec = SegmentTypeHint<typeof spec>

    const parsed = spec.match('/1')

    expect(parsed.choice).toEqual(1);

  });

  it('prevents invalid choices from getting through', () => {
    const spec = root
      ._('/')
      ._('choice', choiceField([1, 2] as const))

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let error: any = null;
    try {
      const foo = spec.match('/12')
      console.log(foo)
    } catch (err) {
      error = err;
    }
    expect(error).toEqual('Didn\'t match')

  });

});
