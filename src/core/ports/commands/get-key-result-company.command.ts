import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { Team } from '@core/modules/team/team.orm-entity'

import { Command } from './base.command'

export class GetKeyResultCompanyCommand extends Command<Team> {
  static type = 'get-key-result-company-command'

  public async execute(keyResult: KeyResult): Promise<Team> {
    const company = await this.core.team.getRootTeamForTeam({ id: keyResult.teamId })

    return company
  }
}
