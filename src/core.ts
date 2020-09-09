import { merge } from './utils';

export enum Mode {
    GET_PARAMS = '~~GET_PARAMS~~',
    SERIALIZE = '~~SERIALIZE~~',
    VALIDATE = '~~VALIDATE~~'
}

export type Field<ExpectedType> = (value: any, mode: Mode) => ExpectedType;

type ValidatorFunctionConstructor<Params, ExpectedType> = (params?: Partial<Params>) => Field<ExpectedType>

export type ValidatorSpec<ExpectedType> = {
  readonly [P in keyof ExpectedType]: Field<ExpectedType[P]>;
};

export type TypeHint<Spec extends ValidatorSpec<any>> = {
  readonly [P in keyof Spec]: ReturnType<Spec[P]>;
}

export type Primitive =
| string
| number
| boolean;

export type Nothing =
| null
| undefined;

export type Json =
| Primitive
| Nothing
| { [property: string]: Json }
| readonly Json[];

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const withErrorDecoration = <R> (key: any, call: () => R): R => {
  try {
    return call()
  } catch (err) {
    if (err.path && err.inner) {
      throw {
        path: [key, ...err.path],
        inner: err.inner
      }
    } else {
      throw {
        path: [key],
        inner: err
      }
    }
  }
}

const mapSpec = <ExpectedType, R> (
  validatorSpec: ValidatorSpec<ExpectedType>,
  transform: (
    validator: Field<ExpectedType>,
    key: any
  ) => R
): any => {
  if (Array.isArray(validatorSpec)) {
    return validatorSpec.map(transform)
  } else {
    return Object.fromEntries(
      Object.entries(validatorSpec).map(
        ([key, validator]: [string, any]) => [key, withErrorDecoration(key, () => transform(validator, key))]
      )
    );
  }
}

const mergeDefined = <T> (full: T, partial?: Partial<T>): Partial<T> =>
  Object.fromEntries(
    Object.entries(
      merge(full, partial)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ).filter(([_, validator]) => validator !== undefined)
  ) as Partial<T>;

export const getParams = <ExpectedType> (validatorSpec: ValidatorSpec<ExpectedType>): any =>
  mapSpec(validatorSpec, validator => validator(undefined, Mode.GET_PARAMS));

// The whole point of the library is to validate wildcard objects
// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const validate = <ExpectedType> (validatorSpec: ValidatorSpec<ExpectedType>, value: any): ExpectedType =>
  mapSpec(validatorSpec, (validator, key) => validator(value[key], Mode.VALIDATE));

export const serialize = <ExpectedType> (validatorSpec: ValidatorSpec<ExpectedType>, value: ExpectedType): any =>
  mapSpec(validatorSpec, (validator, key) => validator((value as any)[key], Mode.SERIALIZE));

export const declareField = <ExpectedType> (conf: {
  validate: (value: any) => ExpectedType,
  serialize: (value: ExpectedType) => Json,
  getParams: () => Json
}): Field<ExpectedType> => (value: any, mode: Mode) => ({
    [Mode.GET_PARAMS]: conf.getParams,
    [Mode.SERIALIZE]: () => conf.serialize(value) as any,
    [Mode.VALIDATE]: () => conf.validate(value) as any
  })[mode]()

export const declareParametrizedField = <ExpectedType, Params> (conf: {
  defaultParams: Params,
  validate: (params: Partial<Params>, value: any) => ExpectedType,
  serialize: (params: Partial<Params>, value: ExpectedType) => Json,
  getParams: (params: Partial<Params>) => Json
}): ValidatorFunctionConstructor<Params, ExpectedType> => (params?: Partial<Params>) => {
    const actualParams = mergeDefined(conf.defaultParams, params);
    return declareField({
      validate: conf.validate.bind(null, actualParams),
      serialize: conf.serialize.bind(null, actualParams),
      getParams: conf.getParams.bind(null, actualParams)
    })
  }
