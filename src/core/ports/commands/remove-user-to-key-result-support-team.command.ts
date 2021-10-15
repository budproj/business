import { Command } from './base.command'

export class RemoveUserToKeyResultSupportTeamCommand extends Command<void> {
  public async execute(keyResultId: string, userId: string): Promise<void> {

    return this.core.keyResult.removeUserToSupportTeam(keyResultId, userId)
  }
}
