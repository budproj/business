import { omit } from 'lodash'

import { GetOptions } from '@core/interfaces/get-options'
import { Team } from '@core/modules/team/team.orm-entity'
import { UserInterface } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'
import { Stopwatch } from '@lib/logger/pino.decorator'

import { Command } from './base.command'

export interface Filters extends Partial<UserInterface> {
  resolveTree?: boolean
  withTeams?: boolean
}

export interface GetTeamMembersCommandResult {
  teams: Team[]
  users: User[]
}

export class GetTeamMembersCommand extends Command<GetTeamMembersCommandResult> {
  @Stopwatch({ includeReturn: true })
  public async execute(
    teamID: string,
    { resolveTree, ...entityFilters }: Filters = {},
    options?: GetOptions<User>,
  ): Promise<GetTeamMembersCommandResult> {
    const filteredEntityFilters = omit(entityFilters, 'withTeams')

    const teams = resolveTree
      ? await this.core.team.getDescendantsByIds([teamID])
      : [await this.core.team.getOne({ id: teamID })]

    const users = await this.core.user.getUsersByTeams(
      teams.map(({ id }) => id),
      filteredEntityFilters,
      options,
    )

    return {
      teams,
      users,
    }
  }
}
