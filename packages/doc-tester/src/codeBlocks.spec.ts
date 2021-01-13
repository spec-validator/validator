import fs from 'fs'

import extractCodeBlocks from './codeBlocks'



test('extractCodeBlocks', () => {
  expect(extractCodeBlocks(
    fs.readFileSync(`${__dirname}/fixtures/README.md`).toString(),
    ['present', 'other-present']
  )).toMatchSnapshot()
})
