import { Command } from '../enums/command.enum'
import { Effect } from '../enums/effect.enum'

export type CommandStatement<S = Effect> = Record<Command, S>
