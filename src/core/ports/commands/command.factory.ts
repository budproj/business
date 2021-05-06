import { Injectable } from '@nestjs/common'

import { CoreProvider } from '@core/core.provider'

import { Command } from './base.command'
import { CreateCheckInCommand } from './create-check-in.command'
import { GetKeyResultCheckInListCommand } from './get-key-result-check-in-list.command'
import { GetKeyResultCompanyCommand } from './get-key-result-company.command'
import { GetKeyResultFromCheckInCommand } from './get-key-result-from-check-in.command'

type CommandConstructor = new (...commandArguments: any[]) => Command<unknown>
export type CommandType =
  | 'create-check-in'
  | 'get-key-result-check-in-list'
  | 'get-key-result-company'
  | 'get-key-result-from-check-in'

@Injectable()
export class CommandFactory {
  private readonly commands: Record<CommandType, CommandConstructor> = {
    'create-check-in': CreateCheckInCommand,
    'get-key-result-check-in-list': GetKeyResultCheckInListCommand,
    'get-key-result-company': GetKeyResultCompanyCommand,
    'get-key-result-from-check-in': GetKeyResultFromCheckInCommand,
  }

  constructor(private readonly core: CoreProvider) {}

  public buildCommand<R>(type: CommandType): Command<R> {
    const Command = this.commands[type]
    const command: Command<R> = new Command(this.core) as any

    return command
  }
}
