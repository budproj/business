import { Team } from '@core/modules/team/team.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'
import { Stopwatch } from '@lib/logger/pino.decorator'

import { Command } from './base.command'

/**
 * @deprecated
 */
export class GetUserTeamTreeCommand extends Command<Team[]> {
  @Stopwatch()
  public async execute(user: Partial<User>): Promise<Team[]> {
    const teams = await this.core.user.getUserTeams(user)
    return this.core.team.getAscendantsByIds(
      teams.map((team) => team.id),
      {},
    )
  }
}
