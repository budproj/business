import { ArgsType, Field, ID } from '@nestjs/graphql'

import { CycleGraphQLNode } from '@interface/graphql/objects/cycle/cycle.node'

import { CycleFiltersRequest } from './cycle-filters.request'

@ArgsType()
export class CyclesInSamePeriodRequest extends CycleFiltersRequest {
  @Field(() => [ID], {
    description: 'Defines a list of cycle IDs we are going to fetch from',
  })
  public readonly fromCycles!: Array<CycleGraphQLNode['id']>
}
