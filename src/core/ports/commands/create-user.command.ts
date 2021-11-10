import { UserInterface } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'

export class CreateUserCommand extends Command<User> {
  public async execute(data: UserInterface): Promise<User> {
    const userFullName = this.core.user.buildUserFullName(data)
    const userCredentials = await this.core.user.generateCredentials(data.email, {
      name: userFullName,
    })

    return this.core.user.createUser({
      ...data,
      authzSub: userCredentials.sub,
    })
  }
}
