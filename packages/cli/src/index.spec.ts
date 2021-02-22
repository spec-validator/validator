import { exec, findJsProjectRoot } from '.'

test('index', () => {
  expect(exec).toBeTruthy()
  expect(findJsProjectRoot).toBeTruthy()
})
