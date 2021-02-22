import fs from 'fs'
import path from 'path'

const copyRec = (src: string, dest: string): void => {
  const isDirectory = fs.statSync(src).isDirectory()
  if (isDirectory) {
    fs.mkdirSync(dest)
    fs.readdirSync(src).forEach(function(childItemName) {
      copyRec(path.join(src, childItemName),
        path.join(dest, childItemName))
    })
  } else {
    fs.copyFileSync(src, dest)
  }
}

export default copyRec
