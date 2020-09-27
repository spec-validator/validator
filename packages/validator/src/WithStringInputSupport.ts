import { Field } from './core';

export interface WithRegExp {
  regex: () => RegExp
}

export interface WithStringInputSupport {
  getFieldWithRegExp(): Field<unknown> & WithRegExp
}
