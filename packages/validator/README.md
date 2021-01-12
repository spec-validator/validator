# @spec-validator/validator

## Core API

Fields can be defined by implementing a `Field` interface via a `declareField` function.

The first parameteter of `declareField` is a string value representing field type and the
second parameter is a function that aims to construct a field object.

`declareField` returns a function with the same interface as the constructor one passed
as the second parameter.

```ts
import { Field } from '@spec-validator/validator'

const shortStringField = declareField('ShortStringField', (): Field<string> => ({
  validate: (value: any): string => {
    if (typeof value !== 'string') {
      throw 'Not a string'
    }
    if (value.length > 5) {
      throw 'Too long string'
    }
    return value
  },
  serialize: (deserialized) => deserialized,
}))
```

Define a schema:

```ts
const schema = {
    title: shortStringField()
}
```

Validate and serialize payload:

```ts
import { validate, serialize } from '@spec-validator/validator'

const deserialized = validate(schema, { title: 'valid' })
const serialized = serialize(schema, deserialized)
```

Infer TypeScript type from schema:

```ts
import { TypeHint } from '@spec-validator/validator'

type Schema = TypeHint<typeof schema>
```

## Fields

Here are the examples of the fields

```ts

```
