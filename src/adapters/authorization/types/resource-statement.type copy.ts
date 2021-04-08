import { Effect } from '../enums/effect.enum'
import { Resource } from '../enums/resource.enum'

export type ResourceStatement<S = Effect> = Record<Resource, S>
