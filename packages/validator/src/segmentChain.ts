import { Field, validate } from './core'
import { WithRegExp, WithStringInputSupport } from './WithStringInputSupport'

export class Segment<DeserializedType> {

  private parent?: Segment<unknown>
  private key?: string;
  private field?: Field<unknown> & WithRegExp

  private regex?: string

  private _root?: Segment<unknown>

  private genRoot(): Segment<unknown> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let cursor: Segment<unknown> = this
    while(cursor.parent) {
      cursor = cursor.parent
    }
    return cursor
  }

  get root(): Segment<unknown> {
    if (!this._root) {
      this._root = this.genRoot()
    }
    return this._root as Segment<unknown>
  }

  constructor(parent?: Segment<unknown>, key?: string, field?: Field<unknown> & WithStringInputSupport) {
    this.parent = parent
    this.key = key
    this.field = field?.getFieldWithRegExp()
  }

  _<Key extends string, ExtraDeserializedType=undefined>(
    key: Key,
    field?: Field<ExtraDeserializedType> & WithStringInputSupport
  ): Segment<[ExtraDeserializedType] extends [undefined] ? DeserializedType : DeserializedType & {
    [P in Key]: ExtraDeserializedType
  }> {
    return new Segment(this, key as any, field) as any
  }

  private getSegments(): Segment<unknown>[] {
    const segments: Segment<unknown>[] = []
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let cursor: Segment<unknown> | undefined = this
    while(cursor) {
      segments.push(cursor)
      cursor = cursor.parent
    }
    segments.reverse()
    return segments
  }

  private getFieldSegments(): Segment<unknown>[] {
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

export type SegmentTypeHint<Spec extends Segment<any>> = ReturnType<Spec['match']>

export const $ = new Segment()
