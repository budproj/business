import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { Team } from '@core/modules/team/team.orm-entity'

import { Command } from './base.command'

export class GetKeyResultCheckInTeamCommand extends Command<Team> {
  public async execute(checkIn: KeyResultCheckIn): Promise<Team> {
    const keyResult = await this.core.keyResult.getFromKeyResultCheckInID(checkIn.id)
    return this.core.team.getFromIndexes({ id: keyResult.teamId })
  }
}
