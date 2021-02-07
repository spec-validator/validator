import { expectType } from '@spec-validator/test-utils/expectType'
import { dateField } from '@spec-validator/validator/fields'
import assert from 'assert'
import { TypeHint, validate, serialize } from '.'

const date = dateField()

expectType<TypeHint<typeof date>, Date>(true)

assert.deepStrictEqual(validate(date, '1995-12-17T03:24:00Z'), new Date('1995-12-17T03:24:00Z'))

assert.deepStrictEqual(serialize(dateField(), new Date('1995-12-17T03:24:00Z')), '1995-12-17T03:24:00.000Z')
assert.deepStrictEqual(serialize(dateField('date'), new Date('1995-12-17T03:24:00Z')), '1995-12-17')
assert.deepStrictEqual(serialize(dateField('time'), new Date('1995-12-17T03:24:00Z')), '03:24:00.000Z')
