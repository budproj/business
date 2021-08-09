import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { ObjectiveRelationFilterProperties } from '@core/modules/objective/objective.repository'
import { EntityOrderAttributes } from '@core/types/order-attribute.type'

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

  public async execute(
    teamID: string,
    properties: Partial<KeyResultInterface>,
    orderAttributes?: EntityOrderAttributes[],
  ): Promise<KeyResult[]> {
    const filters = GetObjectiveKeyResultsCommand.marshalFilters(teamID, properties)

    return this.core.keyResult.getWithRelationFilters(filters, orderAttributes)
  }
}
