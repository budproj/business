import { snakeCase } from 'lodash'

import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { ObjectiveRelationFilterProperties } from '@core/modules/objective/objective.repository'
import { OrderAttribute } from '@core/types/order-attribute.type'

import { Command } from './base.command'

export class GetObjectiveKeyResultsCommand extends Command<KeyResult[]> {
  static marshalFilters(
    objectiveId: string,
    properties: Partial<KeyResultInterface>,
  ): ObjectiveRelationFilterProperties {
    return {
      objective: {
        id: objectiveId,
      },
      keyResult: properties,
    }
  }

  static marshalOrderAttributes(orderAttributes: OrderAttribute[]): OrderAttribute[] {
    return orderAttributes.map(([attribute, direction]) => [
      `${KeyResult.name}.${snakeCase(attribute)}`,
      direction,
    ])
  }

  public async execute(
    teamID: string,
    properties: Partial<KeyResultInterface>,
    orderAttributes?: OrderAttribute[],
  ): Promise<KeyResult[]> {
    const filters = GetObjectiveKeyResultsCommand.marshalFilters(teamID, properties)
    const marshaledOrderAttributes = GetObjectiveKeyResultsCommand.marshalOrderAttributes(
      orderAttributes,
    )

    return this.core.keyResult.getWithRelationFilters(filters, marshaledOrderAttributes)
  }
}
