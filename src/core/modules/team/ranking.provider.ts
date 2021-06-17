import { Injectable } from '@nestjs/common'
import { ModuleRef } from '@nestjs/core'
import { orderBy } from 'lodash'

import { Team } from './team.orm-entity'
import { TeamProvider } from './team.provider'

@Injectable()
export class TeamRankingProvider {
  private teamProvider: TeamProvider
  constructor(private readonly moduleReference: ModuleRef) {}

  public async rankTeamsByProgress(teams: Team[]): Promise<Team[]> {
    const enhanceTeamPromises = teams.map(async (team) => this.enhanceTeamWithProgress(team))
    const enhancedTeams = await Promise.all(enhanceTeamPromises)

    return orderBy(enhancedTeams, ['progress'], ['desc'])
  }

  protected onModuleInit() {
    this.teamProvider = this.moduleReference.get(TeamProvider)
  }

  private async enhanceTeamWithProgress(team: Team) {
    // Const { progress } = await this.teamProvider.getCurrentStatus(team)
    const progress = 0

    return {
      ...team,
      progress,
    }
  }
}
