import { serialize } from 'v8';
import {
  Field,
  declareField,
  ValidatorSpec,
  validate as rawValidate,
  serialize as rawSerialize,
  getParams as rawGetParams
} from '../core';

const objectField = <ExpectedType> (objectSpec: ValidatorSpec<ExpectedType>): Field<ExpectedType> => declareField({
  validate: (value: any): ExpectedType => {
    if (typeof value !== 'object') {
      throw 'Not an object'
    }
    return rawValidate(objectSpec, value)
  },
  serialize: (value: ExpectedType) => rawSerialize(objectSpec, value),
  getParams: () => rawGetParams(objectSpec)
})

export default objectField;
