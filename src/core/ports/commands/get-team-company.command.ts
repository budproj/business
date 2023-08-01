import { Team } from '@core/modules/team/team.orm-entity'

import { Command } from './base.command'

export class GetTeamCompanyCommand extends Command<Team> {
  public async execute(team: Partial<Team>): Promise<Team> {
    // TODO: in the future, we can make sure every callee of this command passes a complete team object and also enforce (team: Team). Then, we can uncomment the lines below
    // if (!team.parentId || team.parentId === team.id) {
    //   return team
    // }

    const [company] = await this.core.team.getRootTeamsForTeams([team.id])

    return company
  }
}
