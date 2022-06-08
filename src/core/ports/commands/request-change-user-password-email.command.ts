import { Command } from './base.command'

export class RequestChangeUserPasswordEmailCommand extends Command<void> {
  public async execute(id: string): Promise<void> {
    const user = await this.core.user.getOne({ id })

    await this.core.user.credentials.requestChangeUserPassword(user.email)
  }
}
