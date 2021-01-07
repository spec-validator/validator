import HtmlSerialization from './html'

const html = new HtmlSerialization()

test('serialize', () => {
  expect(html.serialize('html')).toMatchSnapshot()
})

test('deserialize', () => {
  expect(html.deserialize('html')).toMatchSnapshot()
})
