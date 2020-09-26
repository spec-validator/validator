import { choiceField } from '.';
import { TypeHint, validate } from '../core';
import { root, SegmentTypeHint } from '../segmentChain';

describe('spec', () => {

  it('allows valid choices to get throw', () => {
    const spec = {
    // NOTE: for proper type hints const assertion must be used
      field: choiceField([1, 2, 3] as const),
    }
  type Spec = TypeHint<typeof spec>
  const valid: Spec = validate(spec, {
    field: 1
  });
  expect(valid.field).toEqual(1);
  });

  it('prevents invalid choices from getting through', () => {
    const spec = {
      field: choiceField([1, 2, 3] as const),
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    let error: any = null;
    try {
      validate(spec, {
        field: 4
      });
    } catch (err) {
      error = err;
    }
    expect(error).toEqual({'inner': 'Invalid choice', 'path': ['field']})
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
