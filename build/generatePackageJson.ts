import * as fs from 'fs'

export default (projectPath: string, dependencyPrefix: string): void => {
  const { version, license } = JSON.parse(
    fs.readFileSync('package.json').toString()
  )

  const EXCLUDE = new Set(['devDependencies'])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const packageJson: Record<string, any> = JSON.parse(
    fs.readFileSync(`${projectPath}/package.json`).toString()
  )
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const newPackageJson: Record<string, any> = Object.fromEntries(
    Object.entries(packageJson).filter(it => !EXCLUDE.has(it[0]))
  )

  newPackageJson.version = version
  newPackageJson.license = license

  if (newPackageJson.dependencies) {
    Object.keys(newPackageJson.dependencies).filter(it => it.startsWith(dependencyPrefix)).forEach(it => {
      newPackageJson.dependencies[it] = version
    })
  }

  fs.writeFileSync(
    `${projectPath}/dist/package.json`,
    JSON.stringify(newPackageJson, null, 2)
  )
}
