import { getParams, serialize, TypeHint, validate } from './core'
import { arrayField, booleanField, numberField, Field, optional, stringField, withDefault } from './fields'
import { expectType } from './TypeTestUtils.test'

const schema = {
  innerSchema: Field({
    str: stringField({
      description: 'A string'
    }),
    num: withDefault(numberField({
      description: 'Some number'
    }), 42)
  }),
  innerList: arrayField(Field({
    bool: optional(booleanField()),
    fl: numberField({
      canBeFloat: false,
      description: 'A float'
    })
  }))
}

type Schema = TypeHint<typeof schema>

test('nested expectType', () => {
  expectType<{
    innerSchema: {
      str: string,
      num: number
    },
    innerList: {
      bool?: boolean,
      fl: number
    }[]
  }>({} as Schema)
})

test('nested getParams', () => {
  expect(getParams(schema)).toEqual({
    'innerList': {
      'description': undefined,
      'itemSpec': {
        'description': undefined,
        'spec': {
          'bool': {
            'description': undefined,
            'isOptional': true,
          },
          'fl': {
            'description': 'A float',
          },
        },
      },
    },
    'innerSchema': {
      'description': undefined,
      'spec': {
        'num': {
          'defaultValue': 42,
          'description': 'Some number',
        },
        'str': {
          'description': 'A string',
          'regex': undefined,
        },
      },
    },
  })
})

test('nested serialize', () => {
  expect(serialize(schema, {
    innerSchema: {
      str: 'string',
      num: 12
    },
    innerList: [{
      bool: true,
      fl: 11,
    }]
  } as Schema)).toEqual({
    'innerList': [
      {
        'bool': undefined,
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
  //validate()
})
