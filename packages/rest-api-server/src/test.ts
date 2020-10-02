const one = <T>(composite: T): {
  key: string,
  comp: T
} => ({
    key: 'foo',
    comp: composite
  })

const two = <T>(
  compositeH: () => T,
  handler: (resp: {
    key: string,
    rval: {
      key: string,
      comp: T
    },
  }) => void
) => handler({
    key: 'foo',
    rval: one(compositeH())
  })

const tt = two(() => ({
  one: 11,
  two: 42,
  four: 'true',
  three: 'foo'
}), (resp) => {
  console.log(resp.rval.comp)
})
