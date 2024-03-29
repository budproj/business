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
      'If you set this argument to a user id, it will fetch its objectives. Leave null if you want all objectives.',
    nullable: true,
  })
  public readonly ownerId: string

  @Field(() => ID, {
    description:
      'If you set this argument with a team id, it will fetch team related objectives. Leave null if you want all goals or set the id to null if you want objectives without team id.',
    nullable: true,
  })
  public readonly teamId: string
}
