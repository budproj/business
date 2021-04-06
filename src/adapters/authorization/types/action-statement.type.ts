import { Action } from '@adapters/authorization/enums/action.enum'

import { ScopeStatement } from './scope-statement.type'

export type ActionStatement = Record<Action, ScopeStatement>
