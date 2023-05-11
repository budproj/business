import { flatten, omit } from 'lodash'
import { Any } from 'typeorm'

import { GetOptions } from '@core/interfaces/get-options'
import { Team } from '@core/modules/team/team.orm-entity'
import { UserInterface } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'
import { Stopwatch } from "@lib/logger/pino.decorator";

import { Command } from './base.command'

export interface Filters extends Partial<UserInterface> {
  resolveTree?: boolean
  withTeams?: boolean
}

export class GetTeamMembersCommand extends Command<User[]> {
  @Stopwatch()
  public async execute(
    teamID: string,
    { resolveTree, ...entityFilters }: Filters = {},
    options?: GetOptions<User>,
  ): Promise<User[]> {
    const filteredEntiityFilters = omit(entityFilters, 'withTeams')
    const teams = resolveTree
      ? await this.core.team.getTeamNodesTreeAfterTeam(teamID)
      : [await this.core.team.getOne({ id: teamID })]

    return this.getUsers(teams, filteredEntiityFilters, options)
  }

  @Stopwatch()
  private async getUsers(
    teams: Team[],
    filters?: Partial<UserInterface>,
    options?: GetOptions<User>,
  ): Promise<User[]> {
    const teamUsersPromises = teams.map(async (team) => team.users)
    const teamUsers = await Promise.all(teamUsersPromises)

    const userIDs = flatten(teamUsers).map((u) => u.id)
    const selector = {
      ...filters,
      id: Any(userIDs),
    }

    return this.core.user.getMany(selector, undefined, options)
  }
}
