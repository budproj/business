import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { Team } from '@core/modules/team/team.orm-entity'

import { Command } from './base.command'

export class GetKeyResultTeamCommand extends Command<Team> {
  public async execute(keyResult: KeyResult): Promise<Team> {
    if (!keyResult.teamId) {
      return
    }

    return this.core.team.getFromIndexes({ id: keyResult.teamId })
  }
}
