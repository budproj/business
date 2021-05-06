import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { Team } from '@core/modules/team/team.orm-entity'

import { Command } from './base.command'

export class GetKeyResultTeamTreeCommand extends Command<Team[]> {
  static type = 'get-key-result-team-tree'

  public async execute(keyResult: Partial<KeyResultInterface>): Promise<Team[]> {
    const keyResultTeamIndexes = { id: keyResult.teamId }
    const keyResultTeam = await this.core.team.getFromIndexes(keyResultTeamIndexes)

    const teamTree = await this.core.team.getTeamNodesTreeBeforeTeam(keyResultTeam)

    return teamTree
  }
}
