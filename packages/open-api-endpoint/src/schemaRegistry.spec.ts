import {
  arrayField, booleanField, choiceField, constantField,
  dateField,
  numberField, objectField, optional, stringField, undefinedField, unionField, wildcardObjectField, withDefault,
} from '@spec-validator/validator/fields'
import { Primitive } from '@spec-validator/utils/Json'
import getSchema from './schemaRegistry'
import withDoc from './withDoc'
import { headerArrayField, headerObjectField } from '@spec-validator/rest-api-server/fields'

test('BASE_PAIRS', () => {
  expect([
    arrayField(booleanField()),
    booleanField(),
    headerObjectField({
      a: numberField(),
    }),
    headerArrayField(numberField()),
    numberField(),
    numberField({canBeFloat: true}),
    numberField({signed: true}),
    wildcardObjectField(),
    choiceField(1, 2, 3),
    choiceField<Primitive>(1, true),
    choiceField(),
    constantField(42),
    objectField({
      a: booleanField(),
      b: booleanField(),
    }),
    undefinedField(),
    dateField(),
    objectField({
      opt: optional(stringField()),
    }),
    optional(booleanField()),
    stringField(),
    stringField(/\d+/),
    unionField(
      numberField(),
      stringField(),
      constantField(1),
      objectField({
        a: booleanField(),
        b: booleanField(),
      })
    ),
    withDefault(booleanField(), true),
    withDoc(booleanField(), {
      description: 'Answer',
      format: 'yes/no',
      examples: {
        'yes':{
          summary: 'positive',
          value: true,
        },
        'no': {
          summary: 'negative',
          value: false,
        }},
    }),
  ].map(field => getSchema(field))).toMatchSnapshot()
})
