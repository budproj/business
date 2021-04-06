import { Action } from './enums/action.enum'
import { ScopeStatement } from './scope-statement.interface'

export type ActionStatement = Record<Action, ScopeStatement>
