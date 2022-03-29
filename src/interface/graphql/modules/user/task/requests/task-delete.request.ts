import { ArgsType, Field, ID } from '@nestjs/graphql'

import { ConnectionFiltersRequest } from '@interface/graphql/requests/connection-filters.request'

@ArgsType()
export class TaskDeleteRequest extends ConnectionFiltersRequest {
  @Field(() => ID, { nullable: false, description: 'The id of the task' })
  id: string
}
