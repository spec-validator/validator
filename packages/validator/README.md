# @spec-validator/validator

## Core API

Fields can be defined by implementing a `Field` interface and a `declareField` function:

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

The spec can be defined as follows:

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


## Schema definition

```ts

import { numberField } from '@spec-validator/validator/fields'

const intField = numberField()
const floatField = numberField(true)

```

## Validation against schema

## Serialization

## Defining custom fields

## Implementing custom aspect registry
