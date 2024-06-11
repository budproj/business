import { Logger } from '@nestjs/common'

import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'

import { Command } from './base.command'

export class GetTeamTreeCommand extends Command<Team[]> {
  private readonly logger = new Logger(GetTeamTreeCommand.name)

  public async execute(indexes: Pick<TeamInterface, 'id'>): Promise<Team[]> {
    return this.core.team.getAscendantsByIds([indexes.id], {})
  }
}
