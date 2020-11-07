import { SpecUnion, ValidatorSpec } from '@validator/validator/core'
import { Segment } from '@validator/validator/segmentChain'
import { Optional } from '@validator/validator/utils'
import { StringMapping, Unknown } from './handler'

export type RequestSpec<
  Method extends string = string,
  PathParams extends Optional<StringMapping> = undefined,
  Data extends Optional<Unknown> = undefined,
  QueryParams extends Optional<StringMapping> = undefined,
  Headers extends Optional<StringMapping> = undefined,
> = {
  method: ValidatorSpec<Method>,
  pathSpec: Segment<PathParams>,
  data?: ValidatorSpec<Data>,
  query?: ValidatorSpec<QueryParams>,
  headers?: ValidatorSpec<Headers>
}

export type ResponseSpec<
  Data extends Optional<Unknown> = undefined,
  Headers extends Optional<StringMapping> = undefined
> = {
  data?: SpecUnion<Data>,
  headers?: ValidatorSpec<Headers>
}

