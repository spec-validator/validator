import dfs from './dfs'

const graph = {
  key1: ['key2', 'key3'],
  key2: ['key4', 'key5'],
}

test('tree traversal', () => {
  expect(dfs(graph)).toEqual([
    'key2', 'key5', 'key4',
    'key1', 'key3',
  ])
})
