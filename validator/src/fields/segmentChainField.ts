import {
  Field,
  declareField,
} from '../core';

export type DynamicSegment<Title extends PropertyKey, ExpectedType> = [
  Title,
  Field<ExpectedType>
]

export type SegmentChainSpec<
  ExpectedType,
> = {
  [P in keyof ExpectedType]:
  DynamicSegment<P, ExpectedType[P]>;
};

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

// oh boy don't do this
type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
type LastOf<T> =
  UnionToIntersection<T extends any ? () => T : never> extends () => (infer R) ? R : never

// TS4.0+
type Push<T extends any[], V> = [...T, V];

type TuplifyUnion<T, L=LastOf<T>, N=[T] extends [never] ? true : false> = true extends N ? [] :
  Push<TuplifyUnion1<Exclude<T, L>>, L>
type TuplifyUnion1<T, L=LastOf<T>, N=[T] extends [never] ? true : false> = true extends N ? [] :
  Push<TuplifyUnion2<Exclude<T, L>>, L>
type TuplifyUnion2<T, L=LastOf<T>, N=[T] extends [never] ? true : false> = true extends N ? [] :
  Push<TuplifyUnion3<Exclude<T, L>>, L>
type TuplifyUnion3<T, L=LastOf<T>, N=[T] extends [never] ? true : false> = true extends N ? [] :
  Push<TuplifyUnion4<Exclude<T, L>>, L>
type TuplifyUnion4<T, L=LastOf<T>, N=[T] extends [never] ? true : false> = true extends N ? [] :
  Push<TuplifyUnion5<Exclude<T, L>>, L>
type TuplifyUnion5<T, L=LastOf<T>, N=[T] extends [never] ? true : false> = true extends N ? [] :
  Push<TuplifyUnion6<Exclude<T, L>>, L>
type TuplifyUnion6<T, L=LastOf<T>, N=[T] extends [never] ? true : false> = true extends N ? [] :
  Push<TuplifyUnion7<Exclude<T, L>>, L>
type TuplifyUnion7<T, L=LastOf<T>, N=[T] extends [never] ? true : false> = true extends N ? [] :
  Push<TuplifyUnion8<Exclude<T, L>>, L>
type TuplifyUnion8<T, L=LastOf<T>, N=[T] extends [never] ? true : false> = true extends N ? [] :
  Push<TuplifyUnion9<Exclude<T, L>>, L>
type TuplifyUnion9<T, L=LastOf<T>, N=[T] extends [never] ? true : false> = true extends N ? [] :
  Push<TuplifyUnionX<Exclude<T, L>>, L>
type TuplifyUnionX<T> = never

type foo = {
  one: 11,
  two: 22,
  three: 33,
  four: 44
}

type tupo = TuplifyUnion<keyof foo>
