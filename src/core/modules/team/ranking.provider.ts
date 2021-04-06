import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { orderBy } from 'lodash'

import { TeamEntity } from './team.entity'
import { TeamProvider } from './team.provider'

@Injectable()
export class TeamRankingProvider {
  constructor(
    @Inject(forwardRef(() => TeamProvider))
    private readonly teamProvider: TeamProvider,
  ) {}

  public async rankTeamsByProgress(teams: TeamEntity[]): Promise<TeamEntity[]> {
    const enhanceTeamPromises = teams.map(async (team) => this.enhanceTeamWithProgress(team))
    const enhancedTeams = await Promise.all(enhanceTeamPromises)

    const rankedTeams = orderBy(enhancedTeams, ['progress'], ['desc'])

    return rankedTeams
  }

  private async enhanceTeamWithProgress(team: TeamEntity) {
    const progress = 0 // Await this.teamProvider.getCurrentProgressForTeam(team)

    return {
      ...team,
      progress,
    }
  }
}
