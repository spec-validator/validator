
type ValidatorFunction<T> = (...args: any[]) => T

type ValidatorObject<DeserializedType extends Record<string, unknown> = Record<string, unknown>> = {
  [P in keyof DeserializedType]: ValidatorSpecUnion<DeserializedType[P]>
}

type ValidatorSpecUnion<DeserializedType> = ValidatorFunction<DeserializedType> | ValidatorObject

type TypeHint<Spec extends ValidatorSpecUnion<unknown>> =
  Spec extends ValidatorObject ?
    { [P in keyof Spec]: TypeHint<Spec[P]> }
  : Spec extends ValidatorFunction<unknown> ?
    ReturnType<Spec>
  :
    undefined

const validateString = (input: any): string => {
  if (typeof input !== 'string') {
    throw 'Not a string'
  }
  return input
}


type ActuallyAString = ReturnType<typeof validateString>


const personSchema = {
  firstName: validateString,
  lastName: validateString,
}

type Person = TypeHint<typeof personSchema>
