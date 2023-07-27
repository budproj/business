import { zip, unzip, sortBy, reverse } from 'lodash'
import { FindConditions } from 'typeorm'

import { CoreProvider } from '@core/core.provider'
import { GetOptions } from '@core/interfaces/get-options'
import { Status } from '@core/interfaces/status.interface'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { Command } from '@core/ports/commands/base.command'
import { CommandFactory } from '@core/ports/commands/command.factory'
import { GetTeamStatusOptions } from '@core/ports/commands/get-team-status.command'

/**
 * @deprecated prefer using the `StatusProvider` instead
 */
export class GetTeamRankedDescendantsCommand extends Command<Team[]> {
  private readonly getTeamStatus: Command<Status>

  constructor(protected core: CoreProvider, protected factory: CommandFactory) {
    super(core, factory)

    this.getTeamStatus = this.factory.buildCommand<Status>('get-team-status')
  }

  static rankTeamsByStatus(teams: Team[], status: Status[]): Team[] {
    const zippedTeams = zip(teams, status)
    const ascendingSortedPairs = sortBy(zippedTeams, ([_, status]) => status.progress)
    const descendingSortedPairs = reverse(ascendingSortedPairs)

    const [sortedTeams] = unzip(descendingSortedPairs) as [Team[]]

    return sortedTeams ?? []
  }

  public async execute(
    teamID: string,
    filters?: FindConditions<TeamInterface>,
    queryOptions?: GetOptions<TeamInterface>,
  ): Promise<Team[]> {
    const teamDescendants = await this.core.team.getDescendantsByIds([teamID], false, filters, queryOptions)
    const teamDescendantsStatus = await this.getTeamsStatus(teamDescendants)

    return GetTeamRankedDescendantsCommand.rankTeamsByStatus(teamDescendants, teamDescendantsStatus)
  }

  private async getTeamsStatus(teams: Team[]): Promise<Status[]> {
    const statusOptions: GetTeamStatusOptions = {
      cycleFilters: {
        active: true,
      },
    }
    // TODO: use a single command to get all statuses at once
    const teamStatusPromises = teams.map(async (team) =>
      this.getTeamStatus.execute(team.id, statusOptions),
    )

    return Promise.all(teamStatusPromises)
  }
}
