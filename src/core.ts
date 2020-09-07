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
      Object.assign({}, full, partial)
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
  serialize: (value: ExpectedType) => any,
  getParams: () => any
}): Field<ExpectedType> => (value: any, mode: Mode) => ({
    [Mode.GET_PARAMS]: conf.getParams,
    [Mode.SERIALIZE]: () => conf.serialize(value),
    [Mode.VALIDATE]: () => conf.validate(value)
  })[mode]()

export const declareParametrizedField = <ExpectedType, Params> (conf: {
  defaultParams: Params,
  validate: (params: Partial<Params>, value: any) => ExpectedType,
  serialize?: (params: Partial<Params>, value: ExpectedType) => any,
  getParams?: (params: Partial<Params>) => any
}): ValidatorFunctionConstructor<Params, ExpectedType> => (params?: Partial<Params>) => {
    const actualParams = mergeDefined(conf.defaultParams, params);
    return declareField({
      validate: conf.validate.bind(null, actualParams),
      serialize: conf?.serialize?.bind(null, actualParams) || ((value: ExpectedType) => value),
      getParams: conf?.getParams?.bind(null, actualParams) || (() => params)
    })
  }
