import { HtmlSerialization } from '.'

const html = new HtmlSerialization()

test('serialize', () => {
  expect(html.serialize('html')).toMatchSnapshot()
})

test('serialize', () => {
  expect(html.serialize(undefined)).toMatchSnapshot()
})

test('deserialize', () => {
  expect(html.deserialize('html')).toMatchSnapshot()
})
