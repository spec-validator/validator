const item = (path) => ({
  type: 'add',
  path: `../../../packages/{{name}}/${path}`,
  templateFile: path,
})

module.exports = function (plop) {
  plop.setGenerator('package', {
    prompts: [{
      type: 'input',
      name: 'name',
    }],
    actions: [
      item('src/index.ts'),
      item('src/index.spec.ts'),
      item('README.md'),
      item('package.json'),
    ],
  })
}
