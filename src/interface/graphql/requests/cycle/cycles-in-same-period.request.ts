import { ArgsType, Field, ID } from '@nestjs/graphql'

import { CycleNodeGraphQLObject } from '@interface/graphql/objects/cycle/cycle-node.object'

import { CycleFiltersRequest } from './cycle-filters.request'

@ArgsType()
export class CyclesInSamePeriodRequest extends CycleFiltersRequest {
  @Field(() => [ID], {
    description: 'Defines a list of cycle IDs we are going to fetch from',
  })
  public fromCycles: Array<CycleNodeGraphQLObject['id']>
}
