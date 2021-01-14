const dateField = declareField('DateField', (): Field<Date> => ({
  validate: (value: any): Date => {
    if (typeof value !== 'string') {
      throw 'Not a string'
    }
    return new Date(value)
  },
  serialize: (deserialized) => deserialized.toUTCString(),
}))
