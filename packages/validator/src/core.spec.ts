import { TypeHint } from './core'
import { arrayField, booleanField, numberField, objectField, optional, stringField, withDefault } from './fields'
import { expectType } from '@spec-validator/test-utils/expectType'

const schema1 = objectField({
  bool: optional(booleanField()),
  fl: numberField({
    canBeFloat: false,
  }),
})

type Schema1 = TypeHint<typeof schema1>

test('nested 1 level', () => {
  expectType<Schema1, {
      bool: boolean | undefined,
      fl: number
  }>(true)
})

const schema2 = [{
  bool: optional(booleanField()),
  fl: numberField({
    canBeFloat: false,
  }),
}]

type Schema2 = TypeHint<typeof schema2>

test('nested 2 level', () => {
  expectType<Schema2, {
      bool: boolean | undefined,
      fl: number
  }[]>(true)
})

const schema3 = {
  innerSchema: objectField({
    str: stringField(),
    num: withDefault(numberField(), 42),
  }),
  innerList: arrayField(objectField({
    bool: optional(booleanField()),
    fl: numberField({
      canBeFloat: false,
    }),
  })),
}

type Schema3 = TypeHint<typeof schema3>

test('nested expectType', () => {
  expectType<Schema3, {
    innerSchema: {
      str: string,
      num: number
    },
    innerList: {
      bool: boolean | undefined,
      fl: number
    }[]
  }>(true)
})
