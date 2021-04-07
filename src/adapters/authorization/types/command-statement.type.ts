import { Command } from '@adapters/authorization/enums/command.enum'
import { Effect } from '@adapters/authorization/enums/effect.enum'

export type CommandStatement<S = Effect> = Record<Command, S>
