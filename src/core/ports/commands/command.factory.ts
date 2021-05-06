import { Injectable } from '@nestjs/common'

import { CoreProvider } from '@core/core.provider'

import { Command } from './base.command'
import { CreateCheckInCommand } from './create-check-in.command'
import { GetCheckInWindowForCheckInCommand } from './get-check-in-window-for-check-in.command'
import { GetCycleCommand } from './get-cycle.command'
import { GetKeyResultCheckInListCommand } from './get-key-result-check-in-list.command'
import { GetKeyResultCompanyCommand } from './get-key-result-company.command'
import { GetKeyResultCycleCommand } from './get-key-result-cycle.command'
import { GetKeyResultFromCheckInCommand } from './get-key-result-from-check-in.command'
import { GetKeyResultOwnerCommand } from './get-key-result-owner.command'
import { GetKeyResultTeamTreeCommand } from './get-key-result-team-tree.command'
import { GetKeyResultCommand } from './get-key-result.command'
import { GetTeamOwnerCommand } from './get-team-owner.command'
import { GetUserCompaniesCommand } from './get-user-companies.command'

type CommandConstructor = new (...commandArguments: any[]) => Command<unknown>
export type CommandType =
  | 'create-check-in'
  | 'get-key-result-check-in-list'
  | 'get-key-result-company'
  | 'get-key-result-from-check-in'
  | 'get-key-result-owner'
  | 'get-key-result-team-tree'
  | 'get-key-result'
  | 'get-team-owner'
  | 'get-user-companies'
  | 'get-check-in-window-for-check-in'
  | 'get-cycle'
  | 'get-key-result-cycle'

@Injectable()
export class CommandFactory {
  private readonly commands: Record<CommandType, CommandConstructor> = {
    'create-check-in': CreateCheckInCommand,
    'get-key-result-check-in-list': GetKeyResultCheckInListCommand,
    'get-key-result-company': GetKeyResultCompanyCommand,
    'get-key-result-from-check-in': GetKeyResultFromCheckInCommand,
    'get-key-result-owner': GetKeyResultOwnerCommand,
    'get-key-result-team-tree': GetKeyResultTeamTreeCommand,
    'get-key-result': GetKeyResultCommand,
    'get-team-owner': GetTeamOwnerCommand,
    'get-user-companies': GetUserCompaniesCommand,
    'get-check-in-window-for-check-in': GetCheckInWindowForCheckInCommand,
    'get-cycle': GetCycleCommand,
    'get-key-result-cycle': GetKeyResultCycleCommand,
  }

  constructor(private readonly core: CoreProvider) {}

  public buildCommand<R>(type: CommandType): Command<R> {
    const Command = this.commands[type]
    const command: Command<R> = new Command(this.core) as any

    return command
  }
}
