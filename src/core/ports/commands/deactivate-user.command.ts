import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'

export class DeactivateUserCommand extends Command<User> {
  public async execute(userID: string): Promise<User> {
    await this.core.user.deactivate(userID)

    return this.core.user.getFromID(userID)
  }
}
