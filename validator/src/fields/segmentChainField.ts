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

type IntersectionOfValues<T> =
  {[K in keyof T]: (p: T[K]) => void} extends
    {[n: string]: (p: infer I) => void} ? I : never;

type IntersectionOfFunctionsToType<F, T> =
    F extends {
        (na: infer NA, a: infer A): void;
        (nb: infer NB, b: infer B): void;
        (nc: infer NC, c: infer C): void;
    } ? [NA, A, NB, B, NC, C] :
    F extends {
        (na: infer NA, a: infer A): void;
        (nb: infer NB, b: infer B): void;
    } ? [NA, A, NB, B] :
    F extends {
        (na: infer NA, a: infer A): void
    } ? [NA, A] :
    never;

type ToTuple<T> = IntersectionOfFunctionsToType<
    IntersectionOfValues<{ [K in keyof T]: (k: K, v: T[K]) => void }>, T>;


type foo = {
  one: 11,
  two: 22,
  three: 33
}

type tupo =  ToTuple<foo>
