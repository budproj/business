import { UserInterface } from '@core/modules/user/user.interface'

import { Command } from './base.command'

export class GetUserFullNameCommand extends Command<string> {
  public async execute(user: UserInterface): Promise<string> {
    return this.core.user.buildUserFullName(user)
  }
}
