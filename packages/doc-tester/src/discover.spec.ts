import discover from './discover'

test('with existing path', () => {
  expect(discover(`${__dirname}/fixtures`, /^.*\.md$/, /node_modules/).map(it => it.replace(__dirname, '.')))
    .toMatchSnapshot()
})

test('with missing path', () => {
  expect(discover('fixtures/missing', /^.*\.md$/, /node_modules/).map(it => it.replace(__dirname, '.')))
    .toMatchSnapshot()
})
