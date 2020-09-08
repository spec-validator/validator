import { Field, declareField } from '../core';

const choiceField = <T> (params: {choices: T[], description?: string}): Field<T> => {
  const choicesSet = new Set(params.choices)
  return declareField({
    validate: (value: any): T => {
      if (!choicesSet.has(value)) {
        throw 'Invalid choice'
      }
      return value as T
    },
    serialize: (value: T) => value,
    getParams: () => params,
  })
}

export default choiceField;
