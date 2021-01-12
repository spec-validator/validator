# @spec-validator/validator

## Core API

The main blocks of the API are:

```ts
import { TypeHint, validate, serialize } from '@spec-validator/validator'
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
