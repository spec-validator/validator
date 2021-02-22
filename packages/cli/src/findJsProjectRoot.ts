import fs from 'fs'

export default (path: string): string | undefined => {
  const parts = path.split('/')
  while (parts.length) {
    if (fs.existsSync([...parts, 'package.json'].join('/'))) {
      return parts.join('/')
    }
    parts.pop()
  }
  return undefined
}
