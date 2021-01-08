import { Field } from './core'
import { testValidateSpecError, testValidateSpecOk } from './TestUtils.test'

const sampleField: Field<true> = {
  validate: (it: any): true => {
    if (it === true) {
      return true
    }
    throw 'Boom!'
  },
  serialize: (it: true) => it,
}

const sampleField2: Field<false> = {
  validate: (it: any): false => {
    if (it === false) {
      return false
    }
    throw 'Boom!'
  },
  serialize: (it: false) => it,
}

test('undefined', () => {
  testValidateSpecOk(undefined, undefined)
})

test('field', () => {
  testValidateSpecOk(sampleField, true)
  testValidateSpecError(sampleField, false, 'Boom!')
})

describe('array', () => {
  const spec = [sampleField]

  test('valid input', () => {
    testValidateSpecOk(spec, [true])
  })

  test('not an array', () => {
    testValidateSpecError(spec, false, 'Not an array')
  })

  test('invalid item type', () => {
    testValidateSpecError(spec, [false], {'inner': 'Boom!', 'path': [0]})
  })
})

describe('object', () => {
  const spec = {
    key: sampleField,
    key2: sampleField2,
  }

  test('valid input', () => {
    testValidateSpecOk(spec, {
      key: true,
      key2: false,
    })
  })

  test('not an object', () => {
    testValidateSpecError(spec, false, 'Not an object')
  })

  test('invalid item type', () => {
    testValidateSpecError(spec, {
      key: false,
      key2: false,
    }, {'inner': 'Boom!', 'path': ['key']})
  })
})

describe('nested object', () => {
  const spec = {
    lvl1: {
      key: sampleField2,
      lvl2: {
        value: sampleField,
      },
    },
  }

  test('valid input', () => {
    testValidateSpecOk(spec, {
      lvl1: {
        key: false,
        lvl2: {
          value: true,
        },
      },
    })
  })

  test('invalid item type', () => {
    testValidateSpecError(spec, {
      lvl1: {
        key: false,
        lvl2: {
          value: false,
        },
      },
    }, {'inner': 'Boom!', 'path': ['lvl1', 'lvl2', 'value']})
  })

})

describe('deeply nested object', () => {
  const spec = {
    lvl1: {
      key: sampleField,
      lvl2: {
        key2: sampleField2,
        lvl3: {
          value: sampleField,
        },
      },
    },
  }

  test('valid input', () => {
    testValidateSpecOk(spec, {
      lvl1: {
        key: true,
        lvl2: {
          key2: false,
          lvl3: {
            value: true,
          },
        },
      },
    })
  })

  test('invalid item type', () => {
    testValidateSpecError(spec, {
      lvl1: {
        key: true,
        lvl2: {
          key2: false,
          lvl3: {
            value: false,
          },
        },
      },
    }, {'inner': 'Boom!', 'path': ['lvl1', 'lvl2', 'lvl3', 'value']})
  })

  test('invalid item type', () => {
    testValidateSpecError(spec, {
      lvl1: {
        key: true,
        lvl2: {
          key2: false,
          lvl3: {
            value: false,
          },
        },
      },
    }, {'inner': 'Boom!', 'path': ['lvl1', 'lvl2', 'lvl3', 'value']})
  })

  test('noested not an object', () => {
    testValidateSpecError(spec, {
      lvl1: {
        key: true,
        lvl2: {
          key2: false,
          lvl3: 'boo',
        },
      },
    }, {'inner': 'Not an object', 'path': ['lvl1', 'lvl2', 'lvl3']})
  })
})


/*


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
*/
