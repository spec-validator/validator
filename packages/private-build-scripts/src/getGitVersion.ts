import { getOutput } from '@spec-validator/cli'

export default (): string => {
  if (process.env.CI) {
    const version = getOutput('git', 'tag', '--points-at', 'HEAD').toString()
      .split('\n')
      .find(it => it.match(/^([0-9]+)\.([0-9]+)\.([0-9]+)$/))
    if (!version) {
      throw 'Commit doesn\'t point at any semver tag - can\'t publish'
    }
    return version
  } else {
    return getOutput('git', 'describe').toString()
      .split('\n')[0]
  }
}