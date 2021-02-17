import path from 'path'
import fs from 'fs'

export default (root: string, pattern: RegExp, ignore: RegExp): string[] => {
  const result: string[] = []

  const _fromDir = (parent: string) => {
    if (ignore.test(parent)) {
      // IGNORE
    } else if (fs.lstatSync(parent).isDirectory()) {
      fs.readdirSync(parent).forEach(file => {
        _fromDir(path.join(parent, file))
      })
    } else if (pattern.test(parent)) {
      result.push(parent)
    }
  }

  if (fs.existsSync(root)){
    _fromDir(root)
  }

  return result
}
