import { Command } from './base.command'

export class UpdateUserRoleCommand extends Command<void> {
  public async execute(id: string, role: string): Promise<void> {
    const user = await this.core.user.getOne({ id })
    await this.core.user.credentials.updateUserRole(user.authzSub, role)
  }
}
