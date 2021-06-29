import { Objective } from '@core/modules/objective/objective.orm-entity'
import { ObjectiveRelationFilterProperties } from '@core/modules/objective/objective.repository'

import { Command } from './base.command'

interface GetTeamObjectivesProperties {
  active: boolean
}

export class GetTeamObjectivesCommand extends Command<Objective[]> {
  static marshalFilters(
    teamId: string,
    properties: Partial<GetTeamObjectivesProperties>,
  ): ObjectiveRelationFilterProperties {
    return {
      objective: {
        teamId,
      },
      cycle: {
        active: properties.active,
      },
    }
  }

  public async execute(
    teamID: string,
    properties: Partial<GetTeamObjectivesProperties>,
  ): Promise<Objective[]> {
    const filters = GetTeamObjectivesCommand.marshalFilters(teamID, properties)

    return this.core.objective.getWithRelationFilters(filters)
  }
}
