import { User } from '@core/modules/user/user.orm-entity'
import { Command } from './base.command'

export class GetKeyResultSupportTeamCommand extends Command<User[]> {
  public async execute(
    keyResultID: string,
  ): Promise<User[]> {
    return await this.core.keyResult.getSupportTeam(keyResultID)
  }
}
