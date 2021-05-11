import { Team } from '@core/modules/team/team.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'

export class GetUserTeamTreeCommand extends Command<Team[]> {
  public async execute(user: User): Promise<Team[]> {
    const teams = await this.core.user.getUserTeams(user)
    return this.core.team.getTeamNodesTreeBeforeTeam(teams)
  }
}
