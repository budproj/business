import { Injectable } from '@nestjs/common'

import { Command } from './base.command'

@Injectable()
export class InviteUserCommand extends Command<void> {
  public async execute(userID: string, email?: string): Promise<void> {
    email ??= (await this.core.user.getOne({ id: userID })).email

    await this.core.user.invite(email)
  }
}
