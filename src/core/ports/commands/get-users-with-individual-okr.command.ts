import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'

export class GetUsersWithIndividualOkr extends Command<User[]> {
  public async execute(user: User): Promise<User[]> {
    return this.core.user.getUsersWithObjectives(user)
  }
}
