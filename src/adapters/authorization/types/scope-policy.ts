import { Effect } from '@adapters/authorization/enums/effect.enum'
import { Scope } from '@adapters/authorization/enums/scope.enum'

export type ScopePolicy = Record<Scope, Effect>