const fs = require('fs')

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
      (answers) => {
        const tsConfigPath = `${plop.getPlopfilePath()}/../../../tsconfig.json`
        const tsConfig = JSON.parse(
          fs.readFileSync(tsConfigPath).toString()
        )
        tsConfig.compilerOptions.paths = {
          ...tsConfig.compilerOptions.paths,
          [`@spec-validator/${answers.name}/*`]: [`${answers.name}/src/*`],
          [`@spec-validator/${answers.name}`]: [`${answers.name}/src/index.ts`],
        }
        fs.writeFileSync(
          tsConfigPath,
          JSON.stringify(tsConfig, null, 2) + '\n'
        )
      },
      (answers) => {
        const readMePath = `${plop.getPlopfilePath()}/../../../README.md`
        const readMe = fs.readFileSync(readMePath).toString()
        const appendix = [
          '',
          `- [@spec-validator/${answers.name}](packages/${answers.name}/README.md)`,
          '',
          '  FILL ME',
          '',
          `  \`yarn add --dev @spec-validator/${answers.name}\``,
          '',
        ]
        fs.writeFileSync(
          readMePath,
          readMe + appendix.join('\n')
        )
      },
    ],
  })
}
