import { numberField, objectField } from '.';
import { TypeHint, validate } from '../core';

test('placeholder', () => {
  const spec = {
    field: objectField({
      subField: objectField({
        subSubField: numberField()
      })
    }),
  }
  type Spec = TypeHint<typeof spec>
  const valid: Spec = validate(spec, {
    field: {
      subField: {
        subSubField: 11
      }
    }
  });
  expect(valid.field.subField.subSubField).toEqual(11);
});
