import { forwardRef, Inject, Injectable } from '@nestjs/common'
import { orderBy } from 'lodash'

import DomainTeamService from 'src/domain/team/service'

import { Team } from './entities'

export interface DomainTeamRankingServiceInterface {
  rankTeamsByProgress: (teams: Team[]) => Promise<Team[]>
}

@Injectable()
class DomainTeamRankingService implements DomainTeamRankingServiceInterface {
  constructor(
    @Inject(forwardRef(() => DomainTeamService))
    private readonly teamService: DomainTeamService,
  ) {}

  public async rankTeamsByProgress(teams: Team[]) {
    const enhanceTeamPromises = teams.map(async (team) => this.enhanceTeamWithProgress(team))
    const enhancedTeams = await Promise.all(enhanceTeamPromises)

    const rankedTeams = orderBy(enhancedTeams, ['progress'], ['desc'])

    return rankedTeams
  }

  private async enhanceTeamWithProgress(team: Team) {
    const progress = await this.teamService.getCurrentProgressForTeam(team)

    return {
      ...team,
      progress,
    }
  }
}

export default DomainTeamRankingService
