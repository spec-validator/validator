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

  _<Title extends string, ExtraExpectedType>(
    key: Title,
    field?: Field<ExtraExpectedType>
  ): Segment<ExpectedType & { Title: Field<ExtraExpectedType> }> {
    return new Segment(this, key, field);
  }

}

export const root = new Segment();
