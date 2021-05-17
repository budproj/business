import { Injectable } from '@nestjs/common'

import { CoreProvider } from '@core/core.provider'
import { GetKeyResultCheckInDeltaCommand } from '@core/ports/commands/get-key-result-check-in-delta'
import { GetKeyResultCheckInCommand } from '@core/ports/commands/get-key-result-check-in.command'
import { GetKeyResultCommentTeamCommand } from '@core/ports/commands/get-key-result-comment-team.command'
import { GetKeyResultCommentCommand } from '@core/ports/commands/get-key-result-comment.command'
import { GetKeyResultConfidenceColorCommand } from '@core/ports/commands/get-key-result-confidence-color.command'
import { GetKeyResultTeamCommand } from '@core/ports/commands/get-key-result-team.command'
import { GetUserCommand } from '@core/ports/commands/get-user'
import { GetUserFullNameCommand } from '@core/ports/commands/get-user-full-name'
import { GetUserTeamTreeCommand } from '@core/ports/commands/get-user-team-tree.command'
import { UpdateKeyResultCommand } from '@core/ports/commands/update-key-result.command'

import { Command } from './base.command'
import { CreateKeyResultCheckInCommand } from './create-key-result-check-in.command'
import { CreateKeyResultCommentCommand } from './create-key-result-comment.command'
import { GetCycleCommand } from './get-cycle.command'
import { GetKeyResultCheckInListCommand } from './get-key-result-check-in-list.command'
import { GetKeyResultCheckInTeamCommand } from './get-key-result-check-in-team.command'
import { GetKeyResultCheckInWindowForCheckInCommand } from './get-key-result-check-in-window-for-check-in.command'
import { GetKeyResultCompanyCommand } from './get-key-result-company.command'
import { GetKeyResultCycleCommand } from './get-key-result-cycle.command'
import { GetKeyResultFromCheckInCommand } from './get-key-result-from-check-in.command'
import { GetKeyResultOwnerCommand } from './get-key-result-owner.command'
import { GetKeyResultTeamTreeCommand } from './get-key-result-team-tree.command'
import { GetKeyResultCommand } from './get-key-result.command'
import { GetTeamCompanyCommand } from './get-team-company.command'
import { GetTeamOwnerCommand } from './get-team-owner.command'
import { GetUserCompaniesCommand } from './get-user-companies.command'

type CommandConstructor = new (...commandArguments: any[]) => Command<unknown>
export type CommandType =
  | 'create-check-in'
  | 'create-key-result-comment'
  | 'get-key-result-check-in-list'
  | 'get-key-result-company'
  | 'get-key-result-from-check-in'
  | 'get-key-result-owner'
  | 'get-key-result-team-tree'
  | 'get-key-result'
  | 'get-team-owner'
  | 'get-user-companies'
  | 'get-key-result-check-in-window-for-check-in'
  | 'get-cycle'
  | 'get-key-result-cycle'
  | 'get-key-result-check-in-team'
  | 'get-team-company'
  | 'get-key-result-comment-team'
  | 'update-key-result'
  | 'get-key-result-team'
  | 'get-key-result-check-in'
  | 'get-user'
  | 'get-user-team-tree'
  | 'get-key-result-comment'
  | 'get-user-full-name'
  | 'get-key-result-confidence-color'
  | 'get-key-result-check-in-delta'

@Injectable()
export class CommandFactory {
  private readonly commands: Record<CommandType, CommandConstructor> = {
    'create-check-in': CreateKeyResultCheckInCommand,
    'create-key-result-comment': CreateKeyResultCommentCommand,
    'get-key-result-check-in-list': GetKeyResultCheckInListCommand,
    'get-key-result-company': GetKeyResultCompanyCommand,
    'get-key-result-from-check-in': GetKeyResultFromCheckInCommand,
    'get-key-result-owner': GetKeyResultOwnerCommand,
    'get-key-result-team-tree': GetKeyResultTeamTreeCommand,
    'get-key-result': GetKeyResultCommand,
    'get-team-owner': GetTeamOwnerCommand,
    'get-user-companies': GetUserCompaniesCommand,
    'get-key-result-check-in-window-for-check-in': GetKeyResultCheckInWindowForCheckInCommand,
    'get-cycle': GetCycleCommand,
    'get-key-result-cycle': GetKeyResultCycleCommand,
    'get-key-result-check-in-team': GetKeyResultCheckInTeamCommand,
    'get-team-company': GetTeamCompanyCommand,
    'get-key-result-comment-team': GetKeyResultCommentTeamCommand,
    'update-key-result': UpdateKeyResultCommand,
    'get-key-result-team': GetKeyResultTeamCommand,
    'get-key-result-check-in': GetKeyResultCheckInCommand,
    'get-user': GetUserCommand,
    'get-user-team-tree': GetUserTeamTreeCommand,
    'get-key-result-comment': GetKeyResultCommentCommand,
    'get-user-full-name': GetUserFullNameCommand,
    'get-key-result-confidence-color': GetKeyResultConfidenceColorCommand,
    'get-key-result-check-in-delta': GetKeyResultCheckInDeltaCommand,
  }

  constructor(private readonly core: CoreProvider) {}

  public buildCommand<R>(type: CommandType): Command<R> {
    const Command = this.commands[type]
    return new Command(this.core) as any
  }
}