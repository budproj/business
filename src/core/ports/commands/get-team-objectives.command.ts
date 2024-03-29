import { snakeCase } from 'lodash'

import { Objective } from '@core/modules/objective/objective.orm-entity'
import { ObjectiveRelationFilterProperties } from '@core/modules/objective/objective.repository'
import { EntityOrderAttributes, OrderAttribute } from '@core/types/order-attribute.type'

import { Command } from './base.command'
import { Stopwatch } from '@lib/logger/pino.decorator';

interface GetTeamObjectivesProperties {
  active: boolean
}

export class GetTeamObjectivesCommand extends Command<Objective[]> {
  static marshalFilters(
    teamId: string,
    properties: Partial<GetTeamObjectivesProperties>,
  ): ObjectiveRelationFilterProperties {
    const { active, ...objectiveFilters } = properties
    const cycleFilters = typeof active === 'boolean' ? { cycle: { active } } : {}

    return {
      objective: {
        teamId,
        ...objectiveFilters,
      },
      ...cycleFilters,
    }
  }

  static marshalOrderAttributes(orderAttributes: OrderAttribute[] = []): OrderAttribute[] {
    return orderAttributes.map(([attribute, direction]) => [
      `${Objective.name}.${snakeCase(attribute)}`,
      direction,
    ])
  }

  @Stopwatch({ includeReturn: true })
  public async execute(
    teamID: string,
    properties: Partial<GetTeamObjectivesProperties>,
    orderAttributes?: EntityOrderAttributes[],
  ): Promise<Objective[]> {
    const filters = GetTeamObjectivesCommand.marshalFilters(teamID, properties)

    return this.core.objective.getWithRelationFilters(filters, orderAttributes)
  }
}
