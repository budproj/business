import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { Team } from '@core/modules/team/team.orm-entity'

import { Command } from './base.command'

/**
 * @deprecated
 */
export class GetKeyResultCompanyCommand extends Command<Team> {
  public async execute(keyResult: KeyResult): Promise<Team> {
    if (keyResult.teamId) {
      const [company] = await this.core.team.getRootTeamsForTeams([keyResult.teamId])
      return company
    }

    const user = await this.core.user.getFromID(keyResult.ownerId)
    const [company] = await this.core.team.getUserCompanies(user.id)

    return company
  }
}
