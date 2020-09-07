enum Mode {
    GET_PARAMS = '~~GET_PARAMS~~',
    SERIALIZE = '~~SERIALIZE~~',
    VALIDATE = '~~VALIDATE~~'
}

export type ValidatorFunction<ExpectedType> = (value: any, mode: Mode) => ExpectedType;

type ValidatorFunctionConstructor<Params, ExpectedType> = (params?: Partial<Params>) => ValidatorFunction<ExpectedType>

export type ValidatorSpec<ExpectedType> = {
    readonly [P in keyof ExpectedType]: ValidatorFunction<ExpectedType[P]>;
};

export type TypeHint<Spec extends ValidatorSpec<any>> = {
    readonly [P in keyof Spec]: ReturnType<Spec[P]>;
}

const withErrorDecoration = <R> (key: any, call: () => R) => {
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
        validator: ValidatorFunction<ExpectedType>,
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
      ).filter(([_, validator]) => validator !== undefined)
    ) as Partial<T>;

export const getParams = <ExpectedType> (validatorSpec: ValidatorSpec<ExpectedType>): any =>
  mapSpec(validatorSpec, validator => validator(undefined, Mode.GET_PARAMS));

export const validate = <ExpectedType> (validatorSpec: ValidatorSpec<ExpectedType>, value: any): ExpectedType =>
  mapSpec(validatorSpec, (validator, key) => validator(value[key], Mode.VALIDATE));

export const serialize = <ExpectedType> (validatorSpec: ValidatorSpec<ExpectedType>, value: ExpectedType): any =>
  mapSpec(validatorSpec, (validator, key) => validator((value as any)[key], Mode.SERIALIZE));

export const declareField = <ExpectedType> (
  validate: (value: any) => ExpectedType,
  serialize: (value: ExpectedType) => any,
  getParams: () => any
): ValidatorFunction<ExpectedType> => (value: any, mode: Mode) => ({
    [Mode.GET_PARAMS]: getParams,
    [Mode.SERIALIZE]: () => serialize(value),
    [Mode.VALIDATE]: () => validate(value)
  })[mode]()

export const declareParametrizedField = <ExpectedType, Params> (
  defaultParams: Params,
  validate: (params: Partial<Params>, value: any) => ExpectedType,
  serialize: (params: Partial<Params>, value: ExpectedType) => any = (_, value) => value,
  getParams: (params: Partial<Params>) => any = (params: Partial<Params>) => params
): ValidatorFunctionConstructor<Params, ExpectedType> =>
    (params?: Partial<Params>) =>
      (value: any, mode: Mode) => ({
        [Mode.GET_PARAMS]: getParams,
        [Mode.SERIALIZE]: (actualParams: Partial<Params>) => serialize(actualParams, value),
        [Mode.VALIDATE]: (actualParams: Partial<Params>) => validate(actualParams, value)
      })[mode](mergeDefined(defaultParams, params))
