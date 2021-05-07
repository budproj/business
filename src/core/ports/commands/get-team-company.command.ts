import { Team } from '@core/modules/team/team.orm-entity'

import { Command } from './base.command'

export class GetTeamCompanyCommand extends Command<Team> {
  public async execute(team: Team): Promise<Team> {
    const company = await this.core.team.getRootTeamForTeam(team)

    return company
  }
}
