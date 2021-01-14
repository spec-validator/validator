import path from 'path'
import fs from 'fs'

export default (root: string, pattern: RegExp): string[] => {
  const result: string[] = []

  const _fromDir = (parent: string) =>
    fs.readdirSync(parent).forEach(file => {
      const filename = path.join(parent, file)
      if (fs.lstatSync(filename).isDirectory()) {
        _fromDir(filename)
      } else if (pattern.test(filename)) {
        result.push(filename)
      }
    })

  if (fs.existsSync(root)){
    _fromDir(root)
  }

  return result
}
