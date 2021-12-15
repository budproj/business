import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'

import { Command } from './base.command'

export class CreateTeamCommand extends Command<Team> {
  public async execute(data: TeamInterface): Promise<Team> {
    return this.core.team.createTeam(data)
  }
}
