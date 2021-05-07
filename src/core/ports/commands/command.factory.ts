import { Injectable } from '@nestjs/common'

import { CoreProvider } from '@core/core.provider'
import { GetKeyResultCommentTeamCommand } from '@core/ports/commands/get-key-result-comment-team.command'

import { Command } from './base.command'
import { CreateCheckInCommand } from './create-check-in.command'
import { CreateKeyResultCommentCommand } from './create-key-result-comment.command'
import { GetCheckInDeltaConfidenceTagCommand } from './get-check-in-delta-confidence-tag.command'
import { GetCheckInDeltaProgressCommand } from './get-check-in-delta-progress.command'
import { GetCheckInTeamCommand } from './get-check-in-team.command'
import { GetCheckInWindowForCheckInCommand } from './get-check-in-window-for-check-in.command'
import { GetCycleCommand } from './get-cycle.command'
import { GetKeyResultCheckInListCommand } from './get-key-result-check-in-list.command'
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
  | 'get-check-in-window-for-check-in'
  | 'get-cycle'
  | 'get-key-result-cycle'
  | 'get-check-in-delta-progress'
  | 'get-check-in-delta-confidence-tag'
  | 'get-check-in-team'
  | 'get-team-company'
  | 'get-key-result-comment-team'

@Injectable()
export class CommandFactory {
  private readonly commands: Record<CommandType, CommandConstructor> = {
    'create-check-in': CreateCheckInCommand,
    'create-key-result-comment': CreateKeyResultCommentCommand,
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
    'get-check-in-delta-progress': GetCheckInDeltaProgressCommand,
    'get-check-in-delta-confidence-tag': GetCheckInDeltaConfidenceTagCommand,
    'get-check-in-team': GetCheckInTeamCommand,
    'get-team-company': GetTeamCompanyCommand,
    'get-key-result-comment-team': GetKeyResultCommentTeamCommand,
  }

  constructor(private readonly core: CoreProvider) {}

  public buildCommand<R>(type: CommandType): Command<R> {
    const Command = this.commands[type]
    return new Command(this.core) as any
  }
}
