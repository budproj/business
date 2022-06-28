import { Role } from 'auth0'

import { Command } from './base.command'

export class GetUserRoleCommand extends Command<Role> {
  public async execute(id: string): Promise<Role> {
    const user = await this.core.user.getOne({ id })
    return this.core.user.credentials.getUserRole(user.authzSub)
  }
}
