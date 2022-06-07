import { Command } from './base.command'

export class UpdateUserRoleCommand extends Command<void> {
  public async execute(authzSubUserId: string, role: string): Promise<void> {
    await this.core.user.credentials.updateUserRole(authzSubUserId, role)
  }
}
