import {
  Field,
  declareField,
  ValidatorSpec,
  validate as rawValidate,
  serialize as rawSerialize,
  getParams as rawGetParams
} from '../core';

const objectField = <ExpectedType> (
  objectSpec: ValidatorSpec<ExpectedType>,
  description?: string
): Field<ExpectedType> => declareField({
    validate: (value: any): ExpectedType => {
      if (typeof value !== 'object' || value === null) {
        throw 'Not an object'
      }
      return rawValidate(objectSpec, value)
    },
    serialize: (value: ExpectedType) => rawSerialize(objectSpec, value),
    getParams: () => ({
      description: description,
      spec: rawGetParams(objectSpec)
    })
  })

export default objectField;
