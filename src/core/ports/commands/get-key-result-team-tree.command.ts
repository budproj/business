import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { Team } from '@core/modules/team/team.orm-entity'

import { Command } from './base.command'

export class GetKeyResultTeamTreeCommand extends Command<Team[]> {
  public async execute(keyResult: Partial<KeyResultInterface>): Promise<Team[]> {
    if (!keyResult.teamId) {
      return []
    }

    return this.core.team.getAscendantsByIds([keyResult.teamId], {});
  }
}
