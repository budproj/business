import { ArgsType, Field } from '@nestjs/graphql'

import { ConnectionFiltersRequest } from '@interface/graphql/requests/connection-filters.request'

@ArgsType()
export class ObjectiveFiltersRequest extends ConnectionFiltersRequest {
  @Field(() => Boolean, {
    description:
      'If you set this argument to true or false it will only fetch active or non-active objectives. Leave it null if you want both',
    nullable: true,
    defaultValue: true,
  })
  public readonly active: boolean
}
