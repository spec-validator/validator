const arrayField = <T> (itemValidator: ValidatorFunction<T>) => (value: any): T[] => {
  if (value === GEN_DOC) {
      return {
          itemSpec: itemValidator(GEN_DOC)
      } as any
  }

  if (!Array.isArray(value)) {
      throw 'Not an array'
  }
  return value.map(itemValidator);
}
