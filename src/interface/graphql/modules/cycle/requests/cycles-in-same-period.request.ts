import { ArgsType, Field, ID } from '@nestjs/graphql'

import { CycleGraphQLNode } from '@interface/graphql/nodes/cycle.node'

import { CycleFiltersRequest } from './cycle-filters.request'

@ArgsType()
export class CyclesInSamePeriodRequest extends CycleFiltersRequest {
  @Field(() => [ID], {
    description: 'Defines a list of cycle IDs we are going to fetch from',
  })
  public fromCycles: Array<CycleGraphQLNode['id']>
}
