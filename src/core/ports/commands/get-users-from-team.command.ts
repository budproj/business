import { filter } from "lodash";
import { Logger } from "@nestjs/common";
import { Team } from '@core/modules/team/team.orm-entity'
import { UserStatus } from '@core/modules/user/enums/user-status.enum'
import { User } from '@core/modules/user/user.orm-entity'
import { Stopwatch } from "@lib/logger/pino.decorator";

import { Command } from './base.command'
import { Filters, GetTeamMembersCommandResult } from "./get-team-members.command";

interface GetUsersFromTeamProperties {
  teamID: Team['id']
  filters: Filters & {
    withInactives: boolean
  }
}

export class GetUsersFromTeam extends Command<User[]> {

  private readonly logger = new Logger(GetUsersFromTeam.name)

  @Stopwatch()
  public async execute({ teamID, filters }: GetUsersFromTeamProperties): Promise<User[]> {
    const { withInactives, withTeams, ...otherFilters } = filters
    const queryFilters = withInactives
      ? otherFilters
      : { ...otherFilters, status: UserStatus.ACTIVE }

    // Get team members (users) that belong to teamID
    const getTeamMembersCommand = this.factory.buildCommand<GetTeamMembersCommandResult>('get-team-members')
    const { users } = await getTeamMembersCommand.execute(teamID, queryFilters)

    const unsortedUsers = withTeams ? await this.getWithTeams(teamID, users) : users

    // Sort by name ascending, as the query does not support this feature yet
    return unsortedUsers.sort((left, right) => {
      const comparison = left.firstName.localeCompare(right.firstName)
      if (comparison === 0) {
        return left.lastName.localeCompare(right.lastName)
      }

      return comparison
    })
  }

  private async getWithTeams(teamID: string, users: User[]): Promise<User[]> {
    // From the teamID, find the root team and load all descendants in memory (aka get all teams from the company)
    const [rootTeam] = await this.core.team.getRootTeamsForTeams([teamID])
    const teams = await this.core.team.getDescendantsByIds([rootTeam.id])

    // Create a map of teams to easily find them by id
    const teamsMap = new Map(teams.map(team => [team.id, team]))

    // Get all team-user relations to enable in memory joins
    const relations = await this.core.team.getTeamRelationsByUsers(users.map(({ id }) => id))

    // Join entities in application layer
    // This is not ideal, but still an acceptable replacement for N+1 queries
    return users.map((user) => {
      const teams = filter(
        // Look for all teamIds related to the current user...
        relations[user.id].map(teamId => {
          // ...and look for the team in the teamsMap using the teamId
          const team = teamsMap.get(teamId)
          if (!team) {
            this.logger.warn(`Team ${teamId} not found for user ${user.id}`)
          }

          return team
        })
      )

      return { ...user, teams }
    })
  }
}
