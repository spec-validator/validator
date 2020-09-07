import { Field, declareField, validate, ValidatorSpec } from '../core';

const objectField = <ExpectedType> (objectSpec: ValidatorSpec<ExpectedType>): Field<ExpectedType> => declareField({
  validate: (value: any): ExpectedType => {
    if (typeof value !== 'object') {
      throw 'Not an object'
    }
    return validate(objectSpec, value)
  },
  serialize: (value: any) => {},
  getParams: () => {}
})

export default objectField;
