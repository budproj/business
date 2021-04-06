import { Action } from '@adapters/authorization/enums/action.enum'
import { Resource } from '@adapters/authorization/enums/resource.enum'

export type Policy = `${Resource}:${Action}`
