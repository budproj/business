import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'

export class GetTeamOwnerCommand extends Command<User> {
  static type = 'get-team-owner'

  public async execute(team: TeamInterface): Promise<User> {
    const user = await this.core.user.getFromID(team.ownerId)

    return user
  }
}
