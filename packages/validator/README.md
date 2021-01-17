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
  weight: numberField({ canBeFloat: true }),
  rating: numberField({ signed: true }),
}

type PrimitiveType = TypeHint<typeof primitiveSpec>

const valid: PrimitiveType = validate(primitiveSpec, {
  flag: true,
  title: 'Title',
  email: 'test@example.com',
  count: 12,
  weight: 16.33,
  rating: -10,
})

assert.deepStrictEqual(valid, {
  flag: true,
  title: 'Title',
  email: 'test@example.com',
  count: 12,
  weight: 16.33,
  rating: -10,
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

### Auxilary fields

In addition to primitive and collection fields there are also ones that aim to
match more extensive type checking.

#### **optional**

Once annotated, a payload becomes `T | undefined`:

```ts
import { optional } from '@spec-validator/validator/fields'

const optionalField = optional(numberField())

expectType<TypeHint<typeof optionalField>, number | undefined>(true)

assert.deepStrictEqual(validate(optionalField, 42), 42)
assert.deepStrictEqual(validate(optionalField, undefined), undefined)
```

#### **choiceField**

A union type that may have only primitive types' based constants:

```ts
import { choiceField } from '@spec-validator/validator/fields'

const withChoices = choiceField(1, 2, 3)

expectType<TypeHint<typeof withChoices>, 1 | 2 | 3>(true)

assert.deepStrictEqual(validate(withChoices, 1), 1)
```

#### **dateField**

A mapping between JavaScript-friendly string date value and
a [Date](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/Date)
object.

```ts
import { dateField } from '@spec-validator/validator/fields'

const date = dateField()

expectType<TypeHint<typeof date>, Date>(true)

assert.deepStrictEqual(validate(date, '1995-12-17T03:24:00'), new Date('1995-12-17T03:24:00'))
```

#### **constantField**

Similar to `choiceField` but only with a single valid choice


```ts
import { constantField } from '@spec-validator/validator/fields'

const constant = constantField(11)

expectType<TypeHint<typeof constant>, 11>(true)

assert.deepStrictEqual(validate(constant, 11), 11)
```

#### **withDefault**

Similar to `optional` but instead of returning `undefined` in
case of a missing field.

```ts
import { withDefault } from '@spec-validator/validator/fields'

const defaultValue = withDefault(numberField(), 42)

expectType<TypeHint<typeof defaultValue>, number>(true)

assert.deepStrictEqual(validate(defaultValue, 11), 11)
assert.deepStrictEqual(validate(defaultValue, undefined), 42)
```

#### **unionField**

A field for the cases when an object can have multiple structures
(i.e. union of objects).

```ts
import { unionField } from '@spec-validator/validator/fields'

const union = unionField(
  {
    innerFieldV1: stringField(),
  },
  {
    innerFieldV2: numberField(),
  }
)

expectType<TypeHint<typeof union>, {
  innerFieldV1: string
} | {
  innerFieldV2: number
}>(true)

assert.deepStrictEqual(validate(union, {
  innerFieldV1: 'value'
}), {
  innerFieldV1: 'value'
})
assert.deepStrictEqual(validate(union, {
  innerFieldV2: 42
}), {
  innerFieldV2: 42
})
```

#### **wildcardObjectField**

In case if payload can be virtually anything JSON friendly (i.e. no validation is required)

```ts
import { wildcardObjectField } from '@spec-validator/validator/fields'

const wildCard = wildcardObjectField()

assert.deepStrictEqual(validate(wildCard, '"Abracadabra"'), 'Abracadabra')
```

### Segment field ($)

This special kind of a field with a fluent API, is for outlining a
structure of a string (e.g. a url pattern).

```ts
import { $ } from '@spec-validator/validator/fields'

const url = $
  ._('/')
  ._('username', stringField())
  ._('/items/')
  ._('id', numberField())

assert.deepStrictEqual(url.toString(), '^/(?<username>.*)/items/(?<id>\\d+)$')

expectType<TypeHint<typeof url>, {
  username: string,
  id: number
}>(true)

assert.deepStrictEqual(validate(url, '/john-smith/items/42'), {
  id: 42,
  username: 'john-smith'
})
```
