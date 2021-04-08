import { Command } from '../enums/command.enum'

import { ScopePolicy } from './scope-policy'

export type CommandPolicy = Record<Command, ScopePolicy>
