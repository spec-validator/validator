import objectField from './objectField'
import { Field, FieldWithStringSupport, StringBasedField } from '../core'

import lazyProp from '@spec-validator/utils/lazy-prop'
import { Any } from '@spec-validator/utils/util-types'

export type FieldWithRegExpSupport<Type> = FieldWithStringSupport<Type> & {
  regex: RegExp
}

export class SegmentField<
  DeserializedType
> implements FieldWithRegExpSupport<DeserializedType> {

  type = '@spec-validator/validator/fields/segmentField'

  private parent?: SegmentField<unknown>
  readonly key: string
  readonly field?: Omit<FieldWithRegExpSupport<Any>, 'getStringField'>

  // Here we actually do want to have a constructor parameter as 'any' since it is not going
  // to be used outside of this file
  constructor(parent?: SegmentField<unknown>, key?: string, field?: FieldWithRegExpSupport<any>) {
    this.parent = parent
    this.key = key || ''
    this.field = field?.getStringField()
  }

  getStringField(): StringBasedField<DeserializedType, this> {
    return this
  }

  _<Key extends string, ExtraDeserializedType extends Any = undefined>(
    key: Key,
    field?: FieldWithRegExpSupport<ExtraDeserializedType>
  ): SegmentField<[ExtraDeserializedType] extends [undefined]
    ? DeserializedType : [DeserializedType] extends [undefined] ?
  {
    [P in Key]: ExtraDeserializedType
  } : DeserializedType & {
    [P in Key]: ExtraDeserializedType
  }> {
    return new SegmentField(this, key as any, field)
  }

  get segments(): SegmentField<unknown>[] {
    return lazyProp(this, 'segments', () => {
      const segments: SegmentField<unknown>[] = []
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      let cursor: SegmentField<unknown> | undefined = this
      while (cursor) {
        segments.push(cursor)
        cursor = cursor.parent
      }
      segments.reverse()
      return segments
    })
  }

  private getFieldSegments(): SegmentField<unknown>[] {
    return this.segments.filter(segment => segment.field)
  }

  get regex(): RegExp {
    return lazyProp(this, 'regex', () => new RegExp(`^${this.segments
      .map(segment => segment.field && segment.key
        ? `(?<${segment.key}>${segment.field.regex.source})`
        : (segment.key || '')
      ).join('')}$`))
  }

  get objectSpec(): Record<string, Field<unknown>> | undefined {
    return lazyProp(this, 'objectSpec', () => {
      const fieldSegments = this.getFieldSegments()
      if (fieldSegments.length === 0) {
        return undefined
      } else {
        return Object.fromEntries(fieldSegments.map(it =>
          [it.key as string, it.field as Field<unknown>]
        )) as Record<string, Field<unknown>>
      }
    })
  }

  validate(value: string): DeserializedType {
    const match = value.match(this.regex)
    if (!match) {
      throw 'Didn\'t match'
    }
    const matches = match.groups || {}
    const segments = this.getFieldSegments()
    const spec = Object.fromEntries(segments.map(segment => [segment.key, segment.field])) as any
    return objectField(spec).validate(matches) as unknown as DeserializedType
  }

  serialize(deserialized: DeserializedType): string {
    const result: string[] = []
    this.segments.forEach((it: SegmentField<unknown>) => {
      if (it.field && it.key) {
        result.push(it.field.serialize((deserialized as any)[it.key]) as string)
      } else if (it.key) {
        result.push(it.key)
      }
    })
    return result.join('')
  }

  toString(): string {
    return this.regex.source
  }
}

export default new SegmentField<undefined>()
