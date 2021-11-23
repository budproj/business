import { UserInterface } from '@core/modules/user/user.interface'

import { Command } from './base.command'

export class GetUserInitialsCommand extends Command<string> {
  public async execute(user: UserInterface): Promise<string> {
    return this.core.user.buildUserInitials(user)
  }
}
