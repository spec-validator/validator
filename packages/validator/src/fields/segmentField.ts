import objectField from './objectField'
import { Field, isFieldSpec, FieldWithStringSupport, StringBasedField } from '../core'
import { Any } from '@spec-validator/utils/util-types'

export type FieldWithRegExpSupport<Type> = FieldWithStringSupport<Type> & {
  regex: RegExp
}

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const isFieldWithStringInputSupport = <DeserializedType>(obj: any):
  obj is FieldWithRegExpSupport<DeserializedType> =>
    isFieldSpec(obj) && (obj as any).regex && typeof (obj as any).getStringField === 'function'

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

  get _segments(): SegmentField<unknown>[] {
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

  private segmentsCache: SegmentField<unknown>[] | undefined = undefined
  get segments(): SegmentField<unknown>[] {
    if (!this.segmentsCache) {
      this.segmentsCache = this._segments
    }
    return this.segmentsCache
  }

  private getFieldSegments(): SegmentField<unknown>[] {
    return this.segments.filter(segment => segment.field)
  }

  private get _regex(): RegExp {
    return new RegExp(`^${this.segments
      .map(segment => segment.field && segment.key
        ? `(?<${segment.key}>${segment.field.regex.source})`
        : (segment.key || '')
      ).join('')}$`)
  }

  private regexCache: RegExp | undefined
  get regex(): RegExp {
    if (!this.regexCache) {
      this.regexCache = this._regex
    }
    return this.regexCache
  }

  private get _objectSpec(): Record<string, Field<unknown>> | undefined {
    const fieldSegments = this.getFieldSegments()
    if (fieldSegments.length === 0) {
      return undefined
    } else {
      return Object.fromEntries(fieldSegments.map(it =>
        [it.key as string, it.field as Field<unknown>]
      )) as Record<string, Field<unknown>>
    }
  }

  private objectSpecCacheReady = false
  private objectSpecCache: Record<string, Field<unknown>> | undefined
  get objectSpec(): Record<string, Field<unknown>> | undefined {
    if (!this.objectSpecCacheReady) {
      this.objectSpecCache = this._objectSpec
      this.objectSpecCacheReady = true
    }
    return this.objectSpecCache
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
