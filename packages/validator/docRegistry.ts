import { Field, Json } from './src'
import { SpecUnion } from './src/core'
import { Any } from './src/util-types'

type FieldPair<FieldType extends Field<unknown> = Field<unknown>> =
  [(() => FieldType) & { type: symbol }, (field: FieldType) => Json]

type Registy = [FieldPair]

const getSchema = (
  ...registries: Registy[]
) => (specs: SpecUnion<Any>) => {
  const mapping: Record<symbol, (field: Field<unknown>) => Json> = {}
  registries.forEach(registry => {
    registry.forEach(([key, value]) => {
      mapping[key.type] = value
    })
  })

}
