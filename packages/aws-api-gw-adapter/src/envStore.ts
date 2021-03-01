export default <Keys extends string[], EnvStore = Record<Keys[number], string>> (...keys: Keys) =>
  (setEnv: (key: string, value: string) => void = (key, value) => {
    process.env[key] = value
  }): EnvStore => {
    const env = {} as EnvStore

    keys.forEach(key => {
      Object.defineProperty(env, key, {
        get: () => {
          const value = process.env[key]
          if (!value) {
            throw `Missing env ${key}`
          }
          return value
        },
        set: (value: string) => {
          setEnv(key, value)
        },
      })
    })

    return env
  }
