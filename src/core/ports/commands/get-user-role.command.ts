import { Role } from 'auth0'

import { Command } from './base.command'

export class GetUserRoleCommand extends Command<Role> {
  public async execute(authzSubUserId: string): Promise<Role> {
    return this.core.user.credentials.getUserRole(authzSubUserId)
  }
}
