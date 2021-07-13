import { snakeCase } from 'lodash'

import { Objective } from '@core/modules/objective/objective.orm-entity'
import { ObjectiveRelationFilterProperties } from '@core/modules/objective/objective.repository'
import { OrderAttribute } from '@core/types/order-attribute.type'

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

  static marshalOrderAttributes(orderAttributes: OrderAttribute[] = []): OrderAttribute[] {
    return orderAttributes.map(([attribute, direction]) => [
      `${Objective.name}.${snakeCase(attribute)}`,
      direction,
    ])
  }

  public async execute(
    teamID: string,
    properties: Partial<GetTeamObjectivesProperties>,
    orderAttributes?: OrderAttribute[],
  ): Promise<Objective[]> {
    const filters = GetTeamObjectivesCommand.marshalFilters(teamID, properties)
    const marshaledOrderAttributes = GetTeamObjectivesCommand.marshalOrderAttributes(
      orderAttributes,
    )

    return this.core.objective.getWithRelationFilters(filters, marshaledOrderAttributes)
  }
}
