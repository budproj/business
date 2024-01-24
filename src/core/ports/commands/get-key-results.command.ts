import { ConfidenceTag } from '@adapters/confidence-tag/confidence-tag.enum'
import { GetKeyResultsOutput } from '@core/modules/key-result/key-result.provider'
import { KeyResultFilters } from '@core/modules/key-result/types/key-result-relation-filters-type'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'

import { Command } from './base.command'

export class GetKeyResults extends Command<GetKeyResultsOutput> {
  public async execute(
    team: TeamInterface,
    filters?: KeyResultFilters,
    active = true,
    confidence?: ConfidenceTag,
  ): Promise<GetKeyResultsOutput> {
    const userReachableTeams = await this.core.team.getDescendantsByIds([team.id])
    const userReachableTeamsIds = userReachableTeams.map((team) => team.id)

    const { keyResults, totalCount } = await this.core.keyResult.getKeyResults(
      userReachableTeamsIds,
      filters,
      active,
      confidence,
    )

    return { keyResults, totalCount }
  }
}
