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

  _<Key extends string, ExtraExpectedType=undefined>(
    key: Key,
    field?: Field<ExtraExpectedType>
  ): ExtraExpectedType extends undefined ? Segment<ExpectedType> : Segment<ExpectedType & {
    [P in Key]: ExtraExpectedType
  }> {
    return new Segment(this, key as any, field) as any;
  }

  validate(value: string): ExpectedType {
    return null as any
  }

}

export const root = new Segment();
