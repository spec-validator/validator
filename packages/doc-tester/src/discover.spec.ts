import discover from './discover'

test('with existing path', () => {
  expect(discover(`${__dirname}/fixtures`, /^.*\.md$/)).toMatchSnapshot()
})

test('with missing path', () => {
  expect(discover(`${__dirname}/missing`, /^.*\.md$/)).toMatchSnapshot()
})
