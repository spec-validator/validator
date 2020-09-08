import { arrayField } from '.';
import { TypeHint, validate } from '../core';
import numberField from './numberField';

test('allows valid array to get throw', () => {
  const spec = {
    field: arrayField({itemField: numberField()}),
  }
  type Spec = TypeHint<typeof spec>
  const valid: Spec = validate(spec, {
    field: [1]
  });
  expect(valid.field).toEqual([1]);
});
