import { Effect } from './enums/effect.enum'
import { Scope } from './enums/scope.enum'

export type ScopeStatement = Record<Scope, Effect>
