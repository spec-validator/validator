import {
  Field,
  declareField,
} from '../core';

export type DynamicSegment<ExpectedType, Title> = {
  title: Title,
  validator: Field<ExpectedType>
}

type Segment = string | DynamicSegment<unknown, string>;

type DynamicSegmentSpec<ExpectedType> = {
  [P in keyof ExpectedType]: DynamicSegment<ExpectedType[P], P>[]
}

type SegmentChainSpec<
  ExpectedType,
  P extends keyof ExpectedType,
> = [...[DynamicSegment<ExpectedType[P], string> | string]];

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
  })

export default segmentChainField;
