import { Action } from './enums/action.enum'
import { Resource } from './enums/resource.enum'

export type Policy = `${Resource}:${Action}`
