# Ideas

## Sentiments

The main sentiment of the toolkit is that if it is impossible to deduce
validation logic from TypeScript type definitions (since theose are
stripped upon transpiling) the reverse has process has to be conducted.
I.e. deduce TypeScript types from the validation logic.

Another sentiment is that any sort of code generation results of which are
required to be:

  - stored within a GIT repostiory alongside with with the sources
  - executed explicitly in order to make things work on dev's machine
  - tied to any standard outside of ECMAScript universe

is redundant by definition in comparison with any aproach that does
not impose any of the requirements outlined above.

## Core ideas

- schema based validation process is nothing else but a deserialization
  that throws an exception if the payload does comply with the schema
- a schema in its pure form is a function with the following interface:
  `<OutputType>(input: any) => OutputType`
- nested schemas are achieved via
  [functional composition](https://en.wikipedia.org/wiki/Function_composition_(computer_science))

## Implementation of the ideas

In TypeScript it is possible to obtain a type of the return value of a function
via `ReturnType` built-in auxilary type:

```ts
const validateString = (serialized: any): string => {
  if (typeof serialized !== 'string') {
    throw 'Not a string'
  }
  return serialized
}
type ActuallyAString = ReturnType<typeof validateString>
```

Given that the hierarchical schema is outlined in a non-pure form via native
JS collections such as **arrays** and **objects** the type of a valid payload
can be derived using [recursive types](https://github.com/microsoft/TypeScript/pull/33050).

The rationale behind using a non-pure form to describe schemas is to avoid
syntax redundancy:

Compare:

```ts

type Person = {
  firstName: string,
  lastName: string,
}

const validatePerson = (input: any): Person => ({
  firstName: validateString(input.firstName),
  lastName: validateString(input.lastName),
})
```

with a dramatically less verbose version:

```ts
const personSchema = {
  firstName: validateString,
  lastName: validateString,
}
```

For the exemplary schemas outlined above the recursive types would look as follows:

```ts
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
```

And using these types with the schema outlined just above will look as follows:

```ts
type Person = TypeHint<typeof personSchema>
```

When using functions as the low level building blocks there is a disadvantate though.
There is no non-redundant way to outline the reverse of validation/deserialization -
aka serialization.

When explicit would serialization be meaningful if most of JavaScript primitives are
also Json primitives? When the structure you want to operate with in the implementation
is e.g. a `Date` object.

To enable it, the low level block should be extended into an aggregate of a validation
and a serialization function.

Let's call this aggregate a `Field`:

```ts
export interface Field<DeserializedType> {
  validate(serialized: any): DeserializedType;
  serialize(deserialized: DeserializedType): any
}

type ValidatorObject<DeserializedType extends Record<string, unknown> = Record<string, unknown>> = {
  [P in keyof DeserializedType]: ValidatorSpecUnion<DeserializedType[P]>
}

type ValidatorSpecUnion<DeserializedType> = Field<DeserializedType> | ValidatorObject

type TypeHint<Spec extends ValidatorSpecUnion<unknown>> =
  Spec extends ValidatorObject ?
    { [P in keyof Spec]: TypeHint<Spec[P]> }
  : Spec extends Field<unknown> ?
    ReturnType<Spec['validate']>
  :
    undefined
```

String field may look like:

```ts
const stringField = (): Field<string> => ({
  validate: (serialized: any) => {
    if (typeof serialized !== 'string') {
      throw 'Not a string'
    }
    return serialized
  },
  serialize: (deseriealized: string) => deseriealized,
})
```

With the schema defined as:

```ts
const personSchema = {
  firstName: stringField(),
  lastName: stringField(),
}
```

And type inference working as follows:

```ts
type Person = TypeHint<typeof personSchema>
```

## Schema extension using [aspect oriented programming](https://en.wikipedia.org/wiki/Aspect-oriented_programming)

Since the schema is formalized in a form of JS primitives
rather than types that stripped away in the final artifact the schema
can be used to generate a variety of other hierarcical structures:
OpenAPI specs, JSON schemas, Postman configs, to name but a few.

Inroducing support of any of the above mentioned representation
formats will bloat the core logic of the toolkit. Thus less
redundant and more dynamic apporach is needed.

Within this library aspect oriented programming is leveraged to
dynamically extend the fields as base types thus enabling a variety
of hierarchical schema representations in a loosely-coupled way.
