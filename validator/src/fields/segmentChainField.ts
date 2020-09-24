import {
  Field,
  declareField,
} from '../core';

export type DynamicSegment<Title, ExpectedType> = {
  title: Title,
  validator: Field<ExpectedType>
}

export const segment = <Title extends string, ExpectedType>(
  title: Title,
  validator: Field<ExpectedType>
): DynamicSegment<Title, ExpectedType> => ({
    title,
    validator
  });

export type SegmentChainSpec<
  ExpectedType,
> = Array<DynamicSegment<keyof ExpectedType, ExpectedType[keyof ExpectedType]> | string>;

const segmentChainField = <ExpectedType> (
  segmentChainSpec: SegmentChainSpec<ExpectedType>,
  description?: string
): Field<ExpectedType> => declareField({
    validate: (value: any): ExpectedType => {
      if (typeof value !== 'string') {
        throw 'Not a string'
      }
      return null as any
    },
    serialize: (value: ExpectedType) => null as any,
    getParams: () => ({
      description: description,
      spec: {}
    })
  });

export default segmentChainField;

