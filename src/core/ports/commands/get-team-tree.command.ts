import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'

import { Command } from './base.command'

export class GetTeamTreeCommand extends Command<Team[]> {
  public async execute(indexes: Partial<TeamInterface>): Promise<Team[]> {
    const team = await this.core.team.getFromIndexes(indexes)

    return this.core.team.getTeamNodesTreeBeforeTeam(team)
  }
}
