import path from 'path'

import { getWorkspaceInfo } from './buildOrder'

const relativePath = (parent: string, child: string) => {
  const count = path.posix.normalize(parent).split('/').length
  const dots = []
  for (let i=0; i< count; i++) {
    dots.push('..')
  }
  dots.push(child)
  return dots.join('/')
}

export default (parent: string, child?: string): string => {
  const info = getWorkspaceInfo()
  if (child) {
    return relativePath(info[parent].location, info[child].location)
  } else {
    return info[parent].location
  }
}
