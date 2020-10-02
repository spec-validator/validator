type Composite<One, Two, Three> = {
  one: One,
  two: Two,
  three: Three
}

const one = <T extends Composite<unknown, unknown, unknown>>(composite: T): {
  key: string,
  comp: T
} => ({
    key: 'foo',
    comp: composite
  })

const two = <T extends Composite<unknown, unknown, unknown>>(composite: T): {
  key: string,
  rval: {
    key: string,
    comp: T
  }
} => ({
    key: 'foo',
    rval: one(composite)
  })

const tt = two({
  one: 11,
  two: 42,
  three: 'foo'
})
