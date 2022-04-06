import { ArgsType, Field, ID } from '@nestjs/graphql'

import { ConnectionFiltersRequest } from '@interface/graphql/requests/connection-filters.request'

@ArgsType()
export class TaskUpdateDescriptionRequest extends ConnectionFiltersRequest {
  @Field(() => ID, {
    nullable: true,
    description: 'The Id of the task to be updated',
  })
  id: string

  @Field({
    nullable: true,
    description: 'The description new description of the task',
  })
  description: string
}
