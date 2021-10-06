import { EmailAlreadyExistsException } from '@core/modules/user/exceptions/email-already-exists.exception'
import { UserInterface } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'

export class UpdateUserCommand extends Command<User> {
  public async execute(id: string, newData: Partial<UserInterface>): Promise<User> {
    if (newData.email) await this.blockDuplicatedEmail(newData.email, id)

    const user = await this.core.user.update({ id }, newData)
    if (newData.email) await this.core.user.updateEmailInCredentials(id, newData.email)

    return user
  }

  private async blockDuplicatedEmail(email: string, userID: string): Promise<void> {
    const user = await this.core.user.getFromIndexes({ email })
    if (user && user.id !== userID) throw new EmailAlreadyExistsException(email)
  }
}
