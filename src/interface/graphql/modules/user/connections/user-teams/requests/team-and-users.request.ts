import { ArgsType, Field, ID } from '@nestjs/graphql'

import { ConnectionFiltersRequest } from '@interface/graphql/requests/connection-filters.request'

import { UserOrderInputObject } from '../../../objects/user-order-input.object'

@ArgsType()
export class TeamAndUsersRequest extends ConnectionFiltersRequest<UserOrderInputObject> {
  @Field(() => [ID])
  public readonly usersIDs: string[]

  @Field(() => ID)
  public readonly teamID: string
}
