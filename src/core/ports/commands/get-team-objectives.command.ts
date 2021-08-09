import { snakeCase } from 'lodash'

import { Objective } from '@core/modules/objective/objective.orm-entity'
import { ObjectiveRelationFilterProperties } from '@core/modules/objective/objective.repository'
import { EntityOrderAttributes, OrderAttribute } from '@core/types/order-attribute.type'

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
    orderAttributes?: EntityOrderAttributes[],
  ): Promise<Objective[]> {
    const filters = GetTeamObjectivesCommand.marshalFilters(teamID, properties)

    return this.core.objective.getWithRelationFilters(filters, orderAttributes)
  }
}
