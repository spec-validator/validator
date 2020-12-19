import { Json, Field } from '.'
import { SpecUnion } from './core'
import { Registy } from './registry'
import { Any } from './util-types'

export default (
  ...registries: Registy<Json>[]
) => (specs: SpecUnion<Any>) => {
  const mapping: Record<any, (field: Field<unknown>) => Json> = {}
  registries.forEach(registry => {
    registry.forEach(([key, value]) => {
      if (mapping[key.type]) {
        throw `Field '${key.type}' is already registered`
      }
      mapping[key.type] = value
    })
  })
}
