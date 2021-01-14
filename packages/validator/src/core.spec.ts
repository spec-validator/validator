import { TypeHint } from './core'
import { arrayField, booleanField, numberField, objectField, optional, stringField, withDefault } from './fields'
import { expectType } from '@spec-validator/test-utils/expecType'

const schema = {
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

type Schema = TypeHint<typeof schema>

test('nested expectType', () => {
  expectType<Schema, {
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
