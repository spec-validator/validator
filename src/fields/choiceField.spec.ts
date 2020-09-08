import { choiceField } from '.';
import { TypeHint } from '../core';

test('choiceField validation prevents invalid choices from getting through', () => {
  const spec = {
    field: choiceField({choices: [1, 2, 3]})
  }
  type Spec = TypeHint<typeof spec>

});
