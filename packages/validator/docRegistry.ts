import { Field, Json } from './src'

const generateSchema = <FieldType extends Field<unknown>>(
  mapping: Map<new () => FieldType, (field: FieldType) => Json>
) => {
  // TODO
}
