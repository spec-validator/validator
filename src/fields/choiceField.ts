import { Field, declareField } from '../core';

const choiceField = <Choices extends readonly unknown[], T=Choices[number]> (params: {
  choices: Choices,
  description?: string
}): Field<T> => {
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
