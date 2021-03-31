import fs from 'fs'

export default (what: string, path: string): string => {
  const parts = path.split('/')
  while (parts.length) {
    if (fs.existsSync([...parts, what].join('/'))) {
      return parts.join('/')
    }
    parts.pop()
  }
  throw new Error(`Could not find a directory with ${what} in ${path} and up.`)
}
