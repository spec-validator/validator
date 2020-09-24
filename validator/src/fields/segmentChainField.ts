import {
  Field,
  declareField,
} from '../core';

export type DynamicSegment<Title, ExpectedType> = {
  title: Title,
  validator: Field<ExpectedType>
}

export const segment = <ExpectedType, Title>(
  title: Title,
  validator: Field<ExpectedType>
): DynamicSegment<Title, ExpectedType> => ({
    title,
    validator
  });

export type SegmentChainSpec<
  ExpectedType,
  P extends keyof ExpectedType,
> = Array<DynamicSegment<P, ExpectedType[P]> | string>;

const segmentChainField = <ExpectedType> (
  segmentChainSpec: SegmentChainSpec<ExpectedType, keyof ExpectedType>,
  description?: string
): Field<ExpectedType> => declareField({
    validate: (value: any): ExpectedType => {
      if (!Array.isArray(value)) {
        throw 'Not an array'
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

