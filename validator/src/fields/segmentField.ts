import {
  Field,
  declareField,
  ValidatorSpec,
  validate as rawValidate,
  serialize as rawSerialize,
  getParams as rawGetParams
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
> = [...[ExpectedType[P] | string]];

const segmentChainField = <ExpectedType> (
  segmentChainSpec: SegmentChainSpec<ExpectedType>,
  description?: string
): Field<ExpectedType> => declareField({
    validate: (value: any): ExpectedType => {
      if (typeof value !== 'object' || value === null) {
        throw 'Not an object'
      }
      return rawValidate(objectSpec, value)
    },
    serialize: (value: ExpectedType) => rawSerialize(objectSpec, value),
    getParams: () => ({
      description: description,
      spec: rawGetParams(objectSpec)
    })
  })

export default objectField;
