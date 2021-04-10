import { ArgsType, Field, ID } from '@nestjs/graphql'

import { NodeFiltersRequest } from '@interface/graphql/requests/node-filters.request'

@ArgsType()
export class KeyResultCheckInIndexRequest extends NodeFiltersRequest {
  @Field(() => ID, {
    description: 'Fetches a key-result check-in with a given ID',
    nullable: true,
  })
  public readonly id?: string
}
