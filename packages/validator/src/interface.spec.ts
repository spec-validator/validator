import { validate, serialize } from './interface'
import { stringField } from './fields'

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

test('nested serialize', () => {
  expect(serialize(schema, {
    innerSchema: {
      str: 'string',
      num: 12,
    },
    innerList: [{
      bool: true,
      fl: 11,
    }],
  })).toEqual({
    'innerList': [
      {
        'bool': true,
        'fl': 11,
      },
    ],
    'innerSchema':  {
      'num': 12,
      'str': 'string',
    },
  })
})

test('nested validate', () => {
  expect(validate(schema, {
    innerSchema: {
      str: 'string',
      num: 12,
    },
    innerList: [{
      fl: 11,
    }],
  })).toEqual({
    'innerList': [
      {
        'fl': 11,
      },
    ],
    'innerSchema':  {
      'num': 12,
      'str': 'string',
    },
  })
})

test('nested validate with Error', () => {
  let error: unknown
  try {
    validate(schema, {
      innerSchema: {
        str: 'string',
        num: 12,
      },
      innerList: [{
        fl: 'Some random payload',
      }],
    })
  } catch (err) {
    error = err
  }
  expect(error).toEqual({
    path: [ 'innerList', 0, 'fl' ],
    inner: 'Not a number',
  })
})

test('validate with undefined spec', () => {
  expect(validate(undefined, 'Some value')).toEqual(undefined)
})


test('validate with extra fields with Error', () => {
  let error: unknown
  try {
    validate({
      fieldOne: stringField(),
    }, {
      fieldOne: 'one',
      fieldTwo: 'two',
      fieldThree: 'three',
    })
  } catch (err) {
    error = err
  }
  expect(error).toEqual({
    'extraKeys': [
      'fieldTwo',
      'fieldThree',
    ],
  })

})

test('validate with extra allowed fields', () => {
  expect(
    validate({
      fieldOne: stringField(),
    }, {
      fieldOne: 'one',
      fieldTwo: 'two',
      fieldThree: 'three',
    }, true)
  ).toEqual({fieldOne: 'one'})
})
