import { WithoutOptional } from './util-types'

export type Response<
  Data,
  Headers
> = { statusCode?: number }
  & WithoutOptional<{
    data: Data,
    headers?: Headers,
  }>
