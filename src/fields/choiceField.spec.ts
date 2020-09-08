import { choiceField } from '.';
import { TypeHint, validate } from '../core';

test('choiceField validation prevents invalid choices from getting through', () => {
  const spec = {
    field: choiceField({choices: [1, 2, 3] as const})
  }
  type Spec = TypeHint<typeof spec>
  const valid: Spec = validate(spec, {
    field: 1
  });
  expect(valid.field).toEqual(1);
});
