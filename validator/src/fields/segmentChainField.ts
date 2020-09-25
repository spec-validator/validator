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
  ): Segment<ExpectedType & { [P in Key]: Field<ExtraExpectedType> }> {
    return new Segment(this, key as any, field);
  }

}

export const root = new Segment();
