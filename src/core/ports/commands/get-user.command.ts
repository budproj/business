import { UserInterface } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'

export class GetUserCommand extends Command<User> {
  public async execute(indexes: Partial<UserInterface>): Promise<User> {
    return this.core.user.getFromIndexes(indexes)
  }
}
