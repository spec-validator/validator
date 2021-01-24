import objectField from './objectField'
import { Field, isFieldSpec, FieldWithStringSupport } from '../core'
import { Json } from '@spec-validator/utils/Json'
import { Any } from '@spec-validator/utils/util-types'

export type FieldWithRegExpSupport<Type> = FieldWithStringSupport<Type> & {
  regex: RegExp
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isFieldWithStringInputSupport = <DeserializedType>(obj: any):
  obj is FieldWithRegExpSupport<DeserializedType> =>
    isFieldSpec(obj) && typeof (obj as any).getStringField === 'function'

class SegmentField<
  DeserializedType = undefined
> implements Field<DeserializedType> {

  type = '@spec-validator/validator/fields/segmentField'

  private parent?: SegmentField<unknown>
  private regex?: string

  readonly key: string
  readonly field?: Omit<FieldWithRegExpSupport<Any>, 'getStringField'>

  // Here we actually do want to have a constructor parameter as 'any' since it is not going
  // to be used outside of this file
  constructor(parent?: SegmentField<unknown>, key?: string, field?: FieldWithRegExpSupport<any>) {
    this.parent = parent
    this.key = key || ''
    this.field = field?.getStringField()
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

  // TODO: make getSegments and getFieldSegments lazy props

  getSegments(): SegmentField<unknown>[] {
    const segments: SegmentField<unknown>[] = []
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let cursor: SegmentField<unknown> | undefined = this
    while (cursor) {
      segments.push(cursor)
      cursor = cursor.parent
    }
    segments.reverse()
    return segments
  }

  private getFieldSegments(): SegmentField<unknown>[] {
    return this.getSegments().filter(segment => segment.field)
  }

  private getRegex(): string {
    if (!this.regex) {
      this.regex = `^${this.getSegments()
        .map(segment => segment.field && segment.key
          ? `(?<${segment.key}>${segment.field.regex.source})`
          : (segment.key || '')
        ).join('')}$`
    }
    return this.regex
  }

  getObjectSpec(): Record<string, Field<unknown>> | undefined {
    const fieldSegments = this.getFieldSegments()
    if (fieldSegments.length === 0) {
      return undefined
    } else {
      return Object.fromEntries(fieldSegments.map(it =>
        [it.key as string, it.field as Field<unknown>]
      )) as Record<string, Field<unknown>>
    }
  }

  validate(value: string): DeserializedType {
    const match = value.match(this.getRegex())
    if (!match) {
      throw 'Didn\'t match'
    }
    const matches = match.groups || {}
    const segments = this.getFieldSegments()
    const spec = Object.fromEntries(segments.map(segment => [segment.key, segment.field])) as any
    return objectField(spec).validate(matches)
  }

  serialize(deserialized: DeserializedType): Json {
    const result: string[] = []
    this.getSegments().forEach((it: SegmentField<unknown>) => {
      if (it.field && it.key) {
        result.push(it.field.serialize((deserialized as any)[it.key]) as string)
      } else if (it.key) {
        result.push(it.key)
      }
    })
    return result.join('')
  }

  toString(): string {
    return this.getRegex()
  }
}

export default new SegmentField<unknown>()
