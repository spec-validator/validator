import {
  arrayField, booleanField, choiceField, constantField,
  numberField, objectField, optional, stringField, unionField, wildcardObjectField, withDefault
} from '@validator/validator/fields'
import getSchema from './schemaRegistry'
import withDoc from './withDoc'

test('BASE_PAIRS', () => {
  expect([
    arrayField(booleanField()),
    booleanField(),
    numberField(),
    numberField({canBeFloat: true}),
    wildcardObjectField(),
    choiceField(1, 2, 3),
    constantField(42),
    objectField({
      a: booleanField(),
      b: booleanField()
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
        b: booleanField()
      })
    ),
    withDefault(booleanField(), true),
    withDoc(booleanField(), {
      description: 'Answer',
      format: 'yes/no',
      examples: {
        'yes':{
          summary: 'positive',
          value: true
        },
        'no': {
          summary: 'negative',
          value: false
        }}
    })
  ].map(field => getSchema(field))).toMatchSnapshot()
})
