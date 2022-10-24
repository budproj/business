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
    const { withInactives, withTeams, ...otherFilters } = filters
    const queryFilters = withInactives
      ? otherFilters
      : { ...otherFilters, status: UserStatus.ACTIVE }
    const getTeamMembersCommand = this.factory.buildCommand<User[]>('get-team-members')
    const getUserTeamTree = this.factory.buildCommand<Team[]>('get-user-team-tree')

    const users = await getTeamMembersCommand.execute(teamID, queryFilters)

    if (withTeams) {
      const usersWithTeams = await Promise.all(
        users.map(async (user) => {
          const teams = await getUserTeamTree.execute(user)

          return { ...user, teams }
        }),
      )
      return usersWithTeams
    }

    return users
  }
}
