import { Team } from '@core/modules/team/team.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'
import { Filters } from './get-team-members.command'

interface GetUsersFromTeamProperties {
  teamID: Team['id']
  filters: Filters
}

export class GetUsersFromTeam extends Command<User[]> {
  public async execute({ teamID, filters }: GetUsersFromTeamProperties): Promise<User[]> {
    const getTeamMembersCommand = this.factory.buildCommand<User[]>('get-team-members')

    return getTeamMembersCommand.execute(teamID, filters)
  }
}
