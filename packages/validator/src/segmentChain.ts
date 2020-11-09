import { Field, validate } from './core'
import { Any, Optional } from './util-types'
import { WithRegExp, WithStringInputSupport } from './WithStringInputSupport'

export class Segment<
  DeserializedType extends Optional<Record<string, Any>> = Optional<Record<string, Any>>
> {

  private parent?: Segment
  private key?: string;
  private field?: Field<Any> & WithRegExp

  private regex?: string

  private _root?: Segment

  get root(): Segment {
    if (!this._root) {
      this._root = this.getSegments()[0] as Segment<undefined>
    }
    return this._root
  }

  constructor(parent?: Segment, key?: string, field?: Field<Any> & WithStringInputSupport) {
    this.parent = parent
    this.key = key
    this.field = field?.getFieldWithRegExp()
  }

  _<Key extends string, ExtraDeserializedType extends Any=undefined>(
    key: Key,
    field?: Field<ExtraDeserializedType> & WithStringInputSupport
  ): Segment<[ExtraDeserializedType] extends [undefined] ? DeserializedType : DeserializedType & {
    [P in Key]: ExtraDeserializedType
  }> {
    return new Segment(this, key as any, field) as any
  }

  // TODO: make getSegments and getFieldSegments lazy props

  private getSegments(): Segment[] {
    const segments: Segment[] = []
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let cursor: Segment | undefined = this
    while(cursor) {
      segments.push(cursor)
      cursor = cursor.parent
    }
    segments.reverse()
    return segments
  }

  private getFieldSegments(): Segment[] {
    return this.getSegments().filter(segment => segment.field)
  }

  private getRegex(): string {
    if (!this.regex) {
      this.regex = `^${this.getSegments()
        .map(segment => segment.field && segment.key
          ? `(?<${segment.key}>${segment.field.regex().source})`
          : (segment.key || '')
        ).join('')}$`
    }
    return this.regex
  }

  match(value: string): DeserializedType {
    const matches = value.match(this.getRegex())?.groups
    if (!matches) {
      throw 'Didn\'t match'
    }
    const segments = this.getFieldSegments()
    const spec = Object.fromEntries(segments.map(segment => [segment.key, segment.field]))
    return validate(spec, matches)
  }

  toString(): string {
    return this.getRegex()
  }
}

export const $ = new Segment()
