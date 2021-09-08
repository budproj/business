import { UserInterface } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'

export class GetUsersByIdsCommand extends Command<User[]> {
  public async execute(ids: string[]): Promise<User[]> {
    return this.core.user.getByIds(ids)
  }
}
