import { Team } from '@core/modules/team/team.orm-entity'
import { UserStatus } from '@core/modules/user/enums/user-status.enum'
import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'
import { Filters } from './get-team-members.command'

interface GetUsersFromTeamProperties {
  teamID: Team['id']
  filters: Filters & {
    withInactives: boolean
  }
}

export class GetUsersFromTeam extends Command<User[]> {
  public async execute({ teamID, filters }: GetUsersFromTeamProperties): Promise<User[]> {
    const { withInactives } = filters
    delete filters.withInactives

    const queryFilters = withInactives ? { ...filters } : { ...filters, status: UserStatus.ACTIVE }
    const getTeamMembersCommand = this.factory.buildCommand<User[]>('get-team-members')

    return getTeamMembersCommand.execute(teamID, queryFilters)
  }
}
