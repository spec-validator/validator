# Ideas

## Sentiments

The main sentiment of the toolkit is that if it is impossible to deduce
validation logic from TypeScript type definitions (since theose are
stripped upon transpiling) the reverse process has to be conducted.
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

### Functions as a schema

In TypeScript it is possible to obtain a type of the return value of a function
via `ReturnType` built-in auxilary type:

```ts functions-as-schema
const validateString = (serialized: any): string => {
  if (typeof serialized !== 'string') {
    throw 'Not a string'
  }
  return serialized
}
type ActuallyAString = ReturnType<typeof validateString>
```

Dogmatically sticking, though, to raw functional programming inevitably
leads to a substantial redundancy and declaration duplication in schema
validation domain.

Compare:

```ts functions-as-schema

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

```ts functions-as-schema
const PersonSchema = {
  firstName: validateString,
  lastName: validateString,
}
```

All unecessary duplication and verbosity was removed while keeping
structural definitions and thus semantics.

### Recursive types

A sensible way to outline types for hierarchical schemas composed of native
JS collections such as **arrays** and **objects** is to use
[recursive types](https://github.com/microsoft/TypeScript/pull/33050).

For the exemplary schemas outlined above the recursive types would look as follows:

```ts recursive-types
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

```ts recursive-types
const validateString = (serialized: any): string => {
  if (typeof serialized !== 'string') {
    throw 'Not a string'
  }
  return serialized
}

const PersonSchema = {
  firstName: validateString,
  lastName: validateString,
}

type Person = TypeHint<typeof PersonSchema>
```

### Limitation of functions as the low level blocks

When using functions as the low level building blocks there is a disadvantate though.
There is no non-redundant way to outline the reverse of validation/deserialization -
aka serialization.

When explicit serialization would be meaningful if most of JavaScript primitives are
also Json primitives? When the structure you want to operate with within the implementation
is e.g. a `Date` object.

To enable such behavior, the low level block should be extended into an aggregate of a
validation and a serialization function.

Let's call this aggregate a `Field`:

```ts fields
export interface Field<DeserializedType> {
  validate(serialized: any): DeserializedType
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

The fields may look like:

```ts fields
const stringField = (): Field<string> => ({
  validate: (serialized: any) => {
    if (typeof serialized !== 'string') {
      throw 'Not a string'
    }
    return serialized
  },
  serialize: (deserialized: string) => deserialized,
})

const numberField = (): Field<number> => ({
  validate: (serialized: any) => {
    if (typeof serialized !== 'number') {
      throw 'Not a number'
    }
    return serialized
  },
  serialize: (deserialized: number) => deserialized,
})
```

With the schema defined as:

```ts fields
const PersonSchema = {
  firstName: stringField(),
  lastName: stringField(),
  height: numberField(),
  weight: numberField(),
}
```

And type inference working as follows:

```ts fields
type Person = TypeHint<typeof PersonSchema>

import { expectType } from '@spec-validator/test-utils/expectType'

expectType<Person, {
  firstName: string,
  lastName: string,
  height: number,
  weight: number,
}>(true)
```

To actually leverage the schemas and validate or serialize
payloads using them two functions are needed with the respective
names and the following interfaces:

```ts fields
const serialize = <T>(spec: ValidatorSpecUnion<T>, deserialized: T): any => deserialized as any
const validate = <T>(spec: ValidatorSpecUnion<T>, serialized: any): T => serialized as T

import assert from 'assert'

const payload = {
  firstName: 'name',
  lastName: 'last name',
  height: 11,
  weight: 13.2
}

assert.deepStrictEqual(
  validate(PersonSchema, payload),
  payload
)

assert.deepStrictEqual(
  serialize(PersonSchema, payload),
  payload
)

```

Their implementation is a mental exerceise for the reader ;).
HINT: use recursion and
[type guards](https://www.typescriptlang.org/docs/handbook/advanced-types.html#user-defined-type-guards)
for assistance.

## Schema extension using [aspect oriented programming](https://en.wikipedia.org/wiki/Aspect-oriented_programming)

Since the schema is formalized in a form of JS primitives
rather than types, that are stripped away in the final artifact, the schema
can be used to generate a variety of other hierarcical structures:
OpenAPI specs, JSON schemas, Postman configs, to name but a few.

Inroducing support of any of the above mentioned representation
formats will bloat the core logic of the toolkit. Thus less
redundant and more dynamic apporach is needed.

Within this library aspect oriented programming is leveraged to
dynamically extend the fields as base types thus enabling a variety
of hierarchical schema representations in a loosely-coupled manner.

To enable aspects in general a common practice is to use an
**aspect [registry](https://martinfowler.com/eaaCatalog/registry.html)**.

At the interface level a registry can be a simple function that is able
to return an aspect for an instance of arbitrary type.

Since JavaScript does not have reflection, each instance of a type
must be annotated with a reference to it.

```ts ext
export interface Field<DeserializedType> {
  type: string
  validate(serialized: any): DeserializedType
  serialize(deserialized: DeserializedType): any
}

const stringField = (): Field<string> => ({
  type: 'stringField',
  validate: (serialized: any) => {
    if (typeof serialized !== 'string') {
      throw 'Not a string'
    }
    return serialized
  },
  serialize: (deserialized: string) => deserialized,
})

const numberField = (): Field<number> => ({
  type: 'numberField',
  validate: (serialized: any) => {
    if (typeof serialized !== 'number') {
      throw 'Not a number'
    }
    return serialized
  },
  serialize: (deserialized: number) => deserialized,
})
```

The function representing a registry pattern can be implemented
via a mapping between the type and the aspect:

```ts ext
const MAPPING: Record<string, string> = {
  numberField: 'Number field',
  stringField: 'String field'
}

const getHumanReadableName = (field: Field<unknown>): string =>
  MAPPING[field.type]

import assert from 'assert'

assert.deepStrictEqual(getHumanReadableName(numberField()), 'Number field')
assert.deepStrictEqual(getHumanReadableName(stringField()), 'String field')

```

## Notes

Further nuances and implementation details are better to be obtained
by reading the source code. There is obviously a bunch of corner-cases
that were intentionally ommited in this brief introduction to the
concept.
