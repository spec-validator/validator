export type Optional<T> = T | undefined;

export type KeysOfType<T, U> = Exclude<{ [K in keyof T]: T[K] extends U ? K : never }[keyof T], undefined>;

export type KeysOfNotType<T, U> = Exclude<keyof T, KeysOfType<T, U>>;

export type RequiredKeys<T> = Exclude<KeysOfType<T, Exclude<T[keyof T], undefined>>, undefined>;

export type WithoutOptional<T> = Pick<T, RequiredKeys<T>>;
