import { Effect } from '@adapters/authorization/enums/effect.enum'
import { Resource } from '@adapters/authorization/enums/resource.enum'

export type ResourceStatement<S = Effect> = Record<Resource, S>
