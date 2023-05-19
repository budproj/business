import { FindConditions } from 'typeorm'

import { ConfidenceTag } from '@adapters/confidence-tag/confidence-tag.enum'
import { GetOptions } from '@core/interfaces/get-options'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'

import { Command } from './base.command'

export class GetKeyResults extends Command<KeyResult[]> {
  public async execute(
    team: TeamInterface,
    filters?: FindConditions<KeyResult>,
    options?: GetOptions<KeyResult>,
    active = true,
    confidence?: ConfidenceTag,
  ): Promise<KeyResult[]> {
    const userReachableTeams = await this.core.team.getDescendantsByIds([team.id])
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
