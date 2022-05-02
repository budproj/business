import { FindConditions } from 'typeorm'

import { GetOptions } from '@core/interfaces/get-options'
import { KeyResultConfidenceValue } from '@core/modules/key-result/enums/key-result-confidence.enum'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'

import { Command } from './base.command'

export class GetKeyResults extends Command<any> {
  public async execute(
    team: TeamInterface,
    filters?: FindConditions<KeyResult>,
    options?: GetOptions<KeyResult>,
    active = true,
    confidence?: KeyResultConfidenceValue,
  ): Promise<any> {
    const userReachableTeams = await this.core.team.getUserCompaniesTeams([team.id])
    const userReachableTeamsIds = userReachableTeams.map((team) => team.id)

    const keyResults = await this.core.keyResult.getKeyResults(
      userReachableTeamsIds,
      filters,
      options,
      active,
      confidence,
    )

    return keyResults
  }
}
