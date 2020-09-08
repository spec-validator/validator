import { choiceField } from '.';
import { TypeHint, validate } from '../core';

test('allows valid choices to get throw', () => {
  const spec = {
    field: choiceField({choices: [1, 2, 3] as const}),
  }
  type Spec = TypeHint<typeof spec>
  const valid: Spec = validate(spec, {
    field: 1
  });
  expect(valid.field).toEqual(1);
});


test('prevents invalid choices from getting through', () => {
  const spec = {
    field: choiceField({choices: [1, 2, 3] as const}),
  }
  try {
    validate(spec, {
      field: 4
    });
  } catch (err) {
    expect(err).toEqual({"inner": "Invalid choice", "path": ["field"]})
  }
});
