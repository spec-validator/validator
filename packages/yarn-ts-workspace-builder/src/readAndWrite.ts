import { readFileSync, writeFileSync } from 'fs'

export const read = (path: string): any => JSON.parse(
  readFileSync(path).toString()
)

export const write = (path: string, data: unknown): void => writeFileSync(
  path,
  JSON.stringify(data, null, 2)
)
