import { Injectable } from '@nestjs/common'

import { CoreProvider } from '@core/core.provider'
import { CreateKeyResultCommand } from '@core/ports/commands/create-key-result.command'
import { DeleteKeyResultCommand } from '@core/ports/commands/delete-key-result.command'
import { DeleteObjectiveCommand } from '@core/ports/commands/delete-objective.command'
import { GetCycleDeltaCommand } from '@core/ports/commands/get-cycle-delta.command'
import { GetCycleStatusCommand } from '@core/ports/commands/get-cycle-status.command'
import { GetKeyResultCheckInDeltaCommand } from '@core/ports/commands/get-key-result-check-in-delta.command'
import { GetKeyResultCheckInStatusCommand } from '@core/ports/commands/get-key-result-check-in-status.command'
import { GetKeyResultCheckInCommand } from '@core/ports/commands/get-key-result-check-in.command'
import { GetKeyResultCommentTeamCommand } from '@core/ports/commands/get-key-result-comment-team.command'
import { GetKeyResultCommentCommand } from '@core/ports/commands/get-key-result-comment.command'
import { GetKeyResultConfidenceColorCommand } from '@core/ports/commands/get-key-result-confidence-color.command'
import { GetKeyResultDeltaCommand } from '@core/ports/commands/get-key-result-delta.command'
import { GetKeyResultStatusCommand } from '@core/ports/commands/get-key-result-status.command'
import { GetKeyResultTeamCommand } from '@core/ports/commands/get-key-result-team.command'
import { GetObjectiveDeltaCommand } from '@core/ports/commands/get-objective-delta.command'
import { GetObjectiveStatusCommand } from '@core/ports/commands/get-objective-status.command'
import { GetObjectiveSupportTeamsCommand } from '@core/ports/commands/get-objective-support-teams.command'
import { GetObjectiveTeamTreeCommand } from '@core/ports/commands/get-objective-team-tree.command'
import { GetObjectiveCommand } from '@core/ports/commands/get-objective.command'
import { GetTeamDeltaCommand } from '@core/ports/commands/get-team-delta.command'
import { GetTeamRankedDescendantsCommand } from '@core/ports/commands/get-team-ranked-descendants'
import { GetTeamStatusCommand } from '@core/ports/commands/get-team-status.command'
import { GetTeamSupportObjectivesCommand } from '@core/ports/commands/get-team-support-objectives.command'
import { GetTeamTacticalCycleCommand } from '@core/ports/commands/get-team-tactical-cycle.command'
import { GetTeamTreeCommand } from '@core/ports/commands/get-team-tree.command'
import { GetTeamCommand } from '@core/ports/commands/get-team.command'
import { GetUserFullNameCommand } from '@core/ports/commands/get-user-full-name.command'
import { GetUserTeamTreeCommand } from '@core/ports/commands/get-user-team-tree.command'
import { GetUserCommand } from '@core/ports/commands/get-user.command'
import { UpdateKeyResultCommand } from '@core/ports/commands/update-key-result.command'
import { UpdateObjectiveCommand } from '@core/ports/commands/update-objective.command'

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
  | 'create-key-result'
  | 'create-key-result-comment'
  | 'delete-key-result'
  | 'delete-objective'
  | 'get-cycle'
  | 'get-cycle-delta'
  | 'get-cycle-status'
  | 'get-key-result'
  | 'get-key-result-check-in'
  | 'get-key-result-check-in-delta'
  | 'get-key-result-check-in-list'
  | 'get-key-result-check-in-status'
  | 'get-key-result-check-in-team'
  | 'get-key-result-check-in-window-for-check-in'
  | 'get-key-result-comment'
  | 'get-key-result-comment-team'
  | 'get-key-result-company'
  | 'get-key-result-confidence-color'
  | 'get-key-result-cycle'
  | 'get-key-result-delta'
  | 'get-key-result-from-check-in'
  | 'get-key-result-owner'
  | 'get-key-result-status'
  | 'get-key-result-team'
  | 'get-key-result-team-tree'
  | 'get-objective'
  | 'get-objective-delta'
  | 'get-objective-status'
  | 'get-objective-support-teams'
  | 'get-objective-team-tree'
  | 'get-team'
  | 'get-team-company'
  | 'get-team-delta'
  | 'get-team-owner'
  | 'get-team-ranked-descendants'
  | 'get-team-status'
  | 'get-team-support-objectives'
  | 'get-team-tactical-cycle'
  | 'get-team-tree'
  | 'get-user'
  | 'get-user-companies'
  | 'get-user-full-name'
  | 'get-user-team-tree'
  | 'update-key-result'
  | 'update-objective'

@Injectable()
export class CommandFactory {
  private readonly commands: Record<CommandType, CommandConstructor> = {
    'create-check-in': CreateKeyResultCheckInCommand,
    'create-key-result': CreateKeyResultCommand,
    'create-key-result-comment': CreateKeyResultCommentCommand,
    'delete-key-result': DeleteKeyResultCommand,
    'delete-objective': DeleteObjectiveCommand,
    'get-cycle': GetCycleCommand,
    'get-cycle-delta': GetCycleDeltaCommand,
    'get-cycle-status': GetCycleStatusCommand,
    'get-key-result': GetKeyResultCommand,
    'get-key-result-check-in': GetKeyResultCheckInCommand,
    'get-key-result-check-in-delta': GetKeyResultCheckInDeltaCommand,
    'get-key-result-check-in-list': GetKeyResultCheckInListCommand,
    'get-key-result-check-in-status': GetKeyResultCheckInStatusCommand,
    'get-key-result-check-in-team': GetKeyResultCheckInTeamCommand,
    'get-key-result-check-in-window-for-check-in': GetKeyResultCheckInWindowForCheckInCommand,
    'get-key-result-comment': GetKeyResultCommentCommand,
    'get-key-result-comment-team': GetKeyResultCommentTeamCommand,
    'get-key-result-company': GetKeyResultCompanyCommand,
    'get-key-result-confidence-color': GetKeyResultConfidenceColorCommand,
    'get-key-result-cycle': GetKeyResultCycleCommand,
    'get-key-result-delta': GetKeyResultDeltaCommand,
    'get-key-result-from-check-in': GetKeyResultFromCheckInCommand,
    'get-key-result-owner': GetKeyResultOwnerCommand,
    'get-key-result-status': GetKeyResultStatusCommand,
    'get-key-result-team': GetKeyResultTeamCommand,
    'get-key-result-team-tree': GetKeyResultTeamTreeCommand,
    'get-objective': GetObjectiveCommand,
    'get-objective-delta': GetObjectiveDeltaCommand,
    'get-objective-status': GetObjectiveStatusCommand,
    'get-objective-support-teams': GetObjectiveSupportTeamsCommand,
    'get-objective-team-tree': GetObjectiveTeamTreeCommand,
    'get-team': GetTeamCommand,
    'get-team-company': GetTeamCompanyCommand,
    'get-team-delta': GetTeamDeltaCommand,
    'get-team-owner': GetTeamOwnerCommand,
    'get-team-ranked-descendants': GetTeamRankedDescendantsCommand,
    'get-team-status': GetTeamStatusCommand,
    'get-team-support-objectives': GetTeamSupportObjectivesCommand,
    'get-team-tactical-cycle': GetTeamTacticalCycleCommand,
    'get-team-tree': GetTeamTreeCommand,
    'get-user': GetUserCommand,
    'get-user-companies': GetUserCompaniesCommand,
    'get-user-full-name': GetUserFullNameCommand,
    'get-user-team-tree': GetUserTeamTreeCommand,
    'update-key-result': UpdateKeyResultCommand,
    'update-objective': UpdateObjectiveCommand,
  }

  constructor(private readonly core: CoreProvider) {}

  public buildCommand<R>(type: CommandType): Command<R> {
    const Command = this.commands[type]
    return new Command(this.core, this) as any
  }
}
