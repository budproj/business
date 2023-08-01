import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'

import { Command } from './base.command'

interface AditionalFiltersProperties {
  active?: boolean
}

export class GetObjectivesCommand extends Command<any> {
  static marshalFilters(filters: ObjectiveInterface, aditionalFilters: AditionalFiltersProperties) {
    return {
      objective: filters,
      ...(typeof aditionalFilters.active === 'boolean' ? { cycle: { active: aditionalFilters.active } } : {}),
    }
  }

  public async execute(filters?: ObjectiveInterface, aditionalFilters?: AditionalFiltersProperties): Promise<any> {
    const filtersToQuery = GetObjectivesCommand.marshalFilters(filters, aditionalFilters)

    const objectivesQuantityPromise = await this.core.objective.getWithRelationFilters(filtersToQuery)

    return objectivesQuantityPromise
  }
}
