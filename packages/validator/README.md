# @spec-validator/validator

## Core API

Fields can be defined by implementing a `Field` interface via a `declareField` function.

The first parameteter of `declareField` is a string value representing field type and the
second parameter is a function that aims to construct a field object.

`declareField` returns a function with the same interface as the constructor one passed
as the second parameter.

```ts
import assert from 'assert'

import { Field, declareField } from '@spec-validator/validator/core'

const DAYS = ['MO', 'TU', 'WE', 'TH', 'FR', 'SA', 'SU'] as const

const choices = new Set(DAYS)

type Day = typeof DAYS[number]

const dayField = declareField('DateField', (): Field<Day> => ({
  validate: (value: any): Day => {
    if (!choices.has(value)) {
      throw 'Invalid day'
    }
    return value
  },
  serialize: (deserialized) => deserialized,
}))
```

Define a schema:

```ts
const schema = {
  day: dayField(),
}
```

Validate and serialize payload:

```ts
import { validate, serialize } from '@spec-validator/validator'

const deserialized = validate(schema, { day: 'MO' })

assert.deepStrictEqual(
  deserialized,
  {
    day: 'MO'
  }
)

const serialized = serialize(schema, deserialized)

assert.deepStrictEqual(
  serialized,
  {
    day: 'MO'
  }
)
```

Errors are reported in a structured form with a `path` outlining
location of the error.

```ts

let error: any = undefined

try {
  validate(schema, {
    day: 'Abracadabra',
  })
} catch (err) {
  error = err
}

assert.deepStrictEqual(error, {
  inner: "Invalid day",
  path: [
    'day'
  ]
})

```

Infer TypeScript type from schema:

```ts
import { TypeHint } from '@spec-validator/validator'
import { expectType } from '@spec-validator/test-utils/expectType'

type Schema = TypeHint<typeof schema>

expectType<Schema, {
  day: Day
}>(true)
```

## Fields

### Primitive fields

```ts

import {
  booleanField, numberField, stringField
} from '@spec-validator/validator/fields'

const primitiveSpec = {
  flag: booleanField(),
  title: stringField(),
  // regex for email
  email: stringField(/\S+@\S+\.\S+/),
  count: numberField(),
  // canBeFloat=true
  weight: numberField(true),
}

type PrimitiveType = TypeHint<typeof primitiveSpec>

const valid: PrimitiveType = validate(primitiveSpec, {
  flag: true,
  title: 'Title',
  email: 'test@example.com',
  count: 12,
  weight: 16.33
})

assert.deepStrictEqual(valid, {
  flag: true,
  title: 'Title',
  email: 'test@example.com',
  count: 12,
  weight: 16.33
})
```

### Collection fields

Nested objects and arrays can be outlined as follows:

```ts
const complexSpec = {
  firstLevel: stringField(),
  innerObj: {
    secondLevel: stringField(),
    array: [{
      itemsThirdLevel: stringField()
    }]
  }
}

const validNestedObj = validate(complexSpec, {
  firstLevel: 'First level',
  innerObj: {
    secondLevel: 'Second level',
    array: [
      {
        itemsThirdLevel: 'Third level #1'
      }, {
        itemsThirdLevel: 'Third level #2'
      }
    ]
  }
})

assert.deepStrictEqual(!!validNestedObj, true)
```
