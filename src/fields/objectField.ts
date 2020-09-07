import {
  Field,
  declareField,
  ValidatorSpec,
  validate as rawValidate,
  serialize as rawSerialize,
  getParams as rawGetParams
} from '../core';

const objectField = <ExpectedType> (params: {
  objectSpec: ValidatorSpec<ExpectedType>,
  description?: string
}): Field<ExpectedType> => declareField({
    validate: (value: any): ExpectedType => {
      if (typeof value !== 'object' || value === null) {
        throw 'Not an object'
      }
      return rawValidate(params.objectSpec, value)
    },
    serialize: (value: ExpectedType) => rawSerialize(params.objectSpec, value),
    getParams: () => ({
      description: params.description,
      spec: rawGetParams(params.objectSpec)
    })
  })

export default objectField;
