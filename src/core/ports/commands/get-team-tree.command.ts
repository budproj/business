import { Logger } from '@nestjs/common'

import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'

import { Command } from './base.command'

/**
 * @deprecated
 */
export class GetTeamTreeCommand extends Command<Team[]> {
  private readonly logger = new Logger(GetTeamTreeCommand.name)

  public async execute(indexes: Pick<TeamInterface, 'id'>): Promise<Team[]> {
    if (indexes.id && Object.keys(indexes).length > 1) {
      this.logger.warn(
        `Only indexes.id is allowed as an argument for this command, but other indexes were detected as well. Watch out for unexpected behaviour: indexes=%o`,
        indexes,
      )
    }

    return this.core.team.getAscendantsByIds([indexes.id], {})
  }
}
