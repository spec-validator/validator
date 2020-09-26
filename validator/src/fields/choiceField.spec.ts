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
    try {
      validate(spec, {
        field: 4
      });
    } catch (err) {
      expect(err).toEqual({'inner': 'Invalid choice', 'path': ['field']})
    }
  });

});

describe('segmentChain', () => {
  it('allows valid choices to get throw', () => {
    const spec = root
      ._('/')
      ._('title', choiceField([1, 2, 3] as const))
  type Spec = SegmentTypeHint<typeof spec>

  });

});
