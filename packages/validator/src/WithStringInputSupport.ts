import { Field } from './core'
import { Any } from './util-types'

export interface WithRegExp {
  regex: RegExp
}

export interface WithStringInputSupport {
  getFieldWithRegExp(): Field<Any> & WithRegExp
}
