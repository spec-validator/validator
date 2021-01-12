// eslint-disable-next-line @typescript-eslint/ban-types
export type AnyNonNull = object | string | boolean | symbol | number | { [property: string]: Any }

export type Any = undefined | null | AnyNonNull

export type Optional<T> = T | undefined;

export type KeysOfType<T, U> = Exclude<{ [K in keyof T]: [T[K]] extends [U] ? K : never }[keyof T], undefined>;

export type AllNonNullKeyTypes<T> = Exclude<T[keyof T], undefined>

export type RequiredKeys<T> = KeysOfType<T, AllNonNullKeyTypes<T>>;

type OneWithoutOptional<T, R=RequiredKeys<T>> = [R] extends [never] ? undefined : Pick<T, RequiredKeys<T>>;
type UnionToIntersection<U> =
  (U extends any ? (k: U) => void : never) extends ((k: infer I) => void) ? I : never
type LastOf<T> =
  UnionToIntersection<T extends any ? () => T : never> extends () => (infer R) ? R : never
type Push<T extends any[], V> = [...T, V];
type UnionToTuple<T, L = LastOf<T>, N = [T] extends [never] ? true : false> =
  true extends N ? [] : Push<UnionToTuple<Exclude<T, L>>, L>
type EachInArrayWithoutOptional<T extends any[]> = { [K in keyof T]: OneWithoutOptional<T[K]> }
type EachWithoutOptional<T> = EachInArrayWithoutOptional<UnionToTuple<T>>[number]

export type WithoutOptional<T, U extends T = T> =
  T extends unknown ? [U] extends [T] ? OneWithoutOptional<T> : EachWithoutOptional<T> : OneWithoutOptional<T>

type Impossible<K extends keyof any> = {
  [P in K]: never;
};

export type WithoutExtraProperties<T, U extends T = T> = U & Impossible<Exclude<keyof U, keyof T>>;

export type ConstructorArgs<T> = T extends new (...args: infer U) => any ? U : never
