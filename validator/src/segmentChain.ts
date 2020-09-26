import { Field, validate } from './core';

class Segment<ExpectedType> {

  private parent?: Segment<unknown>
  private key?: string;
  private field?: Field<unknown>

  private regex?: RegExp
  private innerRegex: string

  constructor(parent?: Segment<unknown>, key?: string, field?: Field<unknown>) {
    this.parent = parent;
    this.key = key;
    this.field = field;
    this.innerRegex = `(${ field.regex || '.*' })`
  }

  _<Key extends string, ExtraExpectedType=undefined>(
    key: Key,
    field?: Field<ExtraExpectedType>
  ): ExtraExpectedType extends undefined ? Segment<ExpectedType> : Segment<ExpectedType & {
    [P in Key]: ExtraExpectedType
  }> {
    return new Segment(this, key as any, field) as any;
  }

  private getSegments(): Segment<unknown>[] {
    const segments: Segment<unknown>[] = []
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let cursor: Segment<unknown> | undefined = this;
    while(cursor) {
      segments.push(cursor);
      cursor = cursor.parent;
    }
    segments.reverse()
    return segments;
  }

  private getFieldSegments(): Segment<unknown>[] {
    return this.getSegments().filter(segment => segment.field)
  }

  private getRegex(): RegExp {
    if (!this.regex) {
      this.regex = new RegExp(this.getSegments()
        .map(segment => segment.field && segment.key
          ? this.innerRegex
          : (segment.key || '')
        ).join(''));
    }
    return this.regex;
  }

  match(value: string): ExpectedType {
    const matches = value.match(this.getRegex())?.slice(1);
    if (!matches) {
      throw 'Didn\'t match'
    }
    const segments = this.getFieldSegments();
    const raw = Object.fromEntries(matches.map((match, i) => [segments[i].key, match]));
    const spec = Object.fromEntries(segments.map(segment => [segment.key, segment.field]));
    return validate(spec, raw);
  }
}

export const root = new Segment();
