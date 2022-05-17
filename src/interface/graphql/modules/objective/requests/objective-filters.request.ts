import { ArgsType, Field, ID } from '@nestjs/graphql'

import { ConnectionFiltersRequest } from '@interface/graphql/requests/connection-filters.request'

@ArgsType()
export class ObjectiveFiltersRequest extends ConnectionFiltersRequest {
  @Field(() => Boolean, {
    description:
      'If you set this argument to true or false it will only fetch active or non-active objectives. Leave it null if you want both',
    nullable: true,
  })
  public readonly active: boolean

  @Field(() => ID, {
    description:
      'If you set this argument to true or false it will only fetch active or non-active objectives. Leave it null if you want both',
    nullable: true,
  })
  public readonly ownerId: string

  @Field(() => ID, {
    description:
      'If you set this argument to true or false it will only fetch active or non-active objectives. Leave it null if you want both',
    nullable: true,
  })
  public readonly teamId: string
}
