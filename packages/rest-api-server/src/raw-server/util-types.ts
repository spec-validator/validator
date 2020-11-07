export type Optional<T> = T | undefined;

export type KeysOfType<T, U> = Exclude<{ [K in keyof T]: T[K] extends U ? K : never }[keyof T], undefined>;

export type RequiredKeys<T> = KeysOfType<T, Exclude<T[keyof T], undefined>>;

export type WithoutOptional<T> = Pick<T, RequiredKeys<T>>;
