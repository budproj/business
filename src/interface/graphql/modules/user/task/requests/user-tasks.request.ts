import { ArgsType, Field } from '@nestjs/graphql'

import { ConnectionFiltersRequest } from '@interface/graphql/requests/connection-filters.request'

@ArgsType()
export class UserTasksRequest extends ConnectionFiltersRequest {
  @Field(() => Boolean, {
    nullable: true,
    description: 'A filter to query only tasks that are completed',
    defaultValue: false,
  })
  public onlyUnchecked?: boolean
}
