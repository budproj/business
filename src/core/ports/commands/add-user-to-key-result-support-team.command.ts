import { Command } from './base.command'

export class AddUserToKeyResultSupportTeamCommand extends Command<void> {
  public async execute(keyResultId: string, userId: string): Promise<void> {

    return this.core.keyResult.addUserToSupportTeam(keyResultId, userId)
  }
}
