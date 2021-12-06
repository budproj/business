import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'

import { Command } from './base.command'

export class UpdateTeamCommand extends Command<Team> {
  public async execute(id: string, team: Partial<TeamInterface>): Promise<Team> {
    return this.core.team.update({ id }, team)
  }
}
