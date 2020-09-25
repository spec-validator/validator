import { Field } from '../core';

class Segment<ExpectedType> {

  //_(params: string): Segment<ExpectedType> {
  //  return null as any
  //}

  private parent?: Segment<unknown>
  private key?: string;
  private field?: Field<unknown>

  constructor(parent?: Segment<unknown>, key?: string, field?: Field<unknown>) {
    this.parent = parent;
    this.key = key;
    this.field = field;
  }

  _<Key extends string, ExtraExpectedType>(
    key: Key,
    field?: Field<ExtraExpectedType>
  ): Segment<ExpectedType & { Key: Field<ExtraExpectedType> }> {
    return new Segment(this, key as any, field);
  }

  f<Key extends string>(key: Key): Key { return key }
}

export const root = new Segment();


const a = root.f('abc')
