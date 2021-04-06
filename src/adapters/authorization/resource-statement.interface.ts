import { ActionStatement } from './action-statement.interface'
import { Resource } from './enums/resource.enum'

export type ResourceStatement = Record<Resource, ActionStatement>
