import { Objective } from '@core/modules/objective/objective.orm-entity'
import { ObjectiveRelationFilterProperties } from '@core/modules/objective/objective.repository'
import { EntityOrderAttributes } from '@core/types/order-attribute.type'
import { Stopwatch } from '@lib/logger/pino.decorator'

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

  @Stopwatch({ includeReturn: true })
  public async execute(
    teamID: string,
    properties: Partial<GetTeamSupportObjectivesProperties>,
    orderAttributes?: EntityOrderAttributes[],
  ): Promise<Objective[]> {
    const filters = GetTeamSupportObjectivesCommand.marshalFilters(teamID, properties)

    return this.core.objective.getWithRelationFilters(filters, orderAttributes)
  }
}
