import { Field, declareField, Primitive } from '../core';

const choiceField = <Choices extends readonly Primitive[], T=Choices[number]> (params: {
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
    serialize: (value: T) => value as unknown as Primitive,
    getParams: () => params,
  })
}

export default choiceField;

