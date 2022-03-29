import { ArgsType, Field } from '@nestjs/graphql'

import { ConnectionFiltersRequest } from '@interface/graphql/requests/connection-filters.request'

@ArgsType()
export class TaskCreateRequest extends ConnectionFiltersRequest {
  @Field({
    nullable: true,
    description: 'The description of the task being created',
  })
  description: string
}
