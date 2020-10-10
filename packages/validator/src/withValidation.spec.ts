import { tuple, withValidation } from '.'
import { numberField, stringField } from './fields'

const spec = tuple(
  numberField(),
  numberField(),
  numberField()
)
const wildCard = withValidation(spec, stringField(), (a, b, c) => `${a}${b}${c}`)

test('filters out calls with wrong arguments', () => {
  const result = wildCard(1, 2, 3)
  expect(result).toEqual('123')
})
