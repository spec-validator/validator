export type Primitive =
| string
| number
| boolean

export type Nothing =
| null
| undefined

export type Json =
| Primitive
| Nothing
| { [property: string]: Json }
| readonly Json[]
