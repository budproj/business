import { Objective } from '@core/modules/objective/objective.orm-entity'
import { ObjectiveRelationFilterProperties } from '@core/modules/objective/objective.repository'

import { Command } from './base.command'

interface GetTeamSupportObjectivesProperties {
  active: boolean
}

export class GetTeamSupportObjectivesCommand extends Command<Objective[]> {
  static marshalFilters(
    teamId: string,
    properties: Partial<GetTeamSupportObjectivesProperties>,
  ): ObjectiveRelationFilterProperties {
    return {
      keyResult: {
        teamId,
      },
      cycle: {
        active: properties.active,
      },
    }
  }

  public async execute(
    teamID: string,
    properties: Partial<GetTeamSupportObjectivesProperties>,
  ): Promise<Objective[]> {
    const filters = GetTeamSupportObjectivesCommand.marshalFilters(teamID, properties)

    return this.core.objective.getWithRelationFilters(filters)
  }
}
