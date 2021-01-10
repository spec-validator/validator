import * as fs from 'fs'

export const read = (path: string): any => JSON.parse(
  fs.readFileSync(path).toString()
)

export const write = (path: string, data: unknown): void => fs.writeFileSync(
  path,
  JSON.stringify(data, null, 2)
)
