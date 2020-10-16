import { Field } from '../core'
import { Json } from '../Json'
import { merge } from '../utils'
import objectField from './objectField'
import stringField from './stringField'


type Unioned<T extends Field<unknown>[]> = {
  [P in keyof T]: T[P] extends Field<unknown> ? ReturnType<T[P]['validate']> : never
};

const bla = <T extends Field<unknown>[]>(alts: T): Unioned<T> => null as any

const ff = bla([stringField(), objectField({ foo: stringField()})])
