import { JsonSerialization } from '.'

const json = new JsonSerialization()


test('serialize', () => {
  expect(json.serialize('html')).toMatchSnapshot()
})

test('deserialize', () => {
  expect(json.deserialize('"html"')).toMatchSnapshot()
})
