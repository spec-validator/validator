import { expectType } from '@spec-validator/test-utils/expectType'
import {
  dateField, DateField,
  arrayField, ArrayField,
  booleanField, BooleanField,
  numberField, NumberField,
  objectField, ObjectField,
  stringField, StringField,
  choiceField, ChoiceField,
  withDefault, WithDefault,
  optional, OptionalField,
  unionField, UnionField,
  constantField, ConstantField,
  segmentField, SegmentField,
  wildcardObjectField, WildcardObjectField,
  undefinedField, UndefinedField,
} from '.'

// eslint-disable-next-line max-statements
test('imports', () => {
  expect(dateField).toBeTruthy()
  expect(arrayField).toBeTruthy()
  expect(booleanField).toBeTruthy()
  expect(numberField).toBeTruthy()
  expect(objectField).toBeTruthy()
  expect(stringField).toBeTruthy()
  expect(choiceField).toBeTruthy()
  expect(withDefault).toBeTruthy()
  expect(optional).toBeTruthy()
  expect(unionField).toBeTruthy()
  expect(constantField).toBeTruthy()
  expect(segmentField).toBeTruthy()
  expect(wildcardObjectField).toBeTruthy()
  expect(undefinedField).toBeTruthy()

  expectType<DateField, DateField>(true)
  expectType<ArrayField<any>, ArrayField<any>>(true)
  expectType<BooleanField, BooleanField>(true)
  expectType<NumberField, NumberField>(true)
  expectType<ObjectField<any>, ObjectField<any>>(true)
  expectType<StringField, StringField>(true)
  expectType<ChoiceField<any>, ChoiceField<any>>(true)
  expectType<WithDefault<any>, WithDefault<any>>(true)
  expectType<OptionalField<any>, OptionalField<any>>(true)
  expectType<UnionField<any>, UnionField<any>>(true)
  expectType<ConstantField<any>, ConstantField<any>>(true)
  expectType<SegmentField<any>, SegmentField<any>>(true)
  expectType<WildcardObjectField, WildcardObjectField>(true)
  expectType<UndefinedField, UndefinedField>(true)
})
