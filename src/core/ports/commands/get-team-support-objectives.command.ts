import { snakeCase } from 'lodash'

import { Objective } from '@core/modules/objective/objective.orm-entity'
import { ObjectiveRelationFilterProperties } from '@core/modules/objective/objective.repository'
import { OrderAttribute } from '@core/types/order-attribute.type'

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

  static marshalOrderAttributes(orderAttributes: OrderAttribute[] = []): OrderAttribute[] {
    return orderAttributes.map(([attribute, direction]) => [
      `${Objective.name}.${snakeCase(attribute)}`,
      direction,
    ])
  }

  public async execute(
    teamID: string,
    properties: Partial<GetTeamSupportObjectivesProperties>,
    orderAttributes?: OrderAttribute[],
  ): Promise<Objective[]> {
    const filters = GetTeamSupportObjectivesCommand.marshalFilters(teamID, properties)
    const marshaledOrderAttributes = GetTeamSupportObjectivesCommand.marshalOrderAttributes(
      orderAttributes,
    )

    return this.core.objective.getWithRelationFilters(filters, marshaledOrderAttributes)
  }
}
