import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'

export class GetKeyResultOwnerCommand extends Command<User> {
  public async execute(keyResult: KeyResultInterface): Promise<User> {
    const user = await this.core.user.getFromID(keyResult.ownerId)

    return user
  }
}
