import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'

interface CommandInput {
  userID: string
  teamID: string
}

export class AddTeamToUserCommand extends Command<User> {
  public async execute({ userID, teamID }: CommandInput): Promise<User> {
    await this.core.team.addUserToTeam(userID, teamID)

    return this.core.user.getFromID(userID)
  }
}
