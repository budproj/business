import { ArgsType, Field } from '@nestjs/graphql'

import { SortingGraphQLEnum } from '@interface/graphql/enums/sorting.enum'
import { ConnectionFiltersRequest } from '@interface/graphql/requests/connection-filters.request'

import { UserOrderInputObject } from '../objects/user-order-input.object'

@ArgsType()
export class UserFiltersRequest extends ConnectionFiltersRequest<UserOrderInputObject> {
  @Field(() => UserOrderInputObject, {
    nullable: true,
    defaultValue: {
      firstName: SortingGraphQLEnum.ASC,
    },
    description: 'Define the expected order for our users connection edges',
  })
  public order?: UserOrderInputObject

  @Field(() => Boolean, {
    nullable: true,
    description: 'Define if the query should return only users with individual objectives',
  })
  public onlyWithIndividualObjectives?: boolean

  @Field(() => Boolean, {
    nullable: true,
    description: 'Define if the query should return only active users or not',
  })
  public withInactives?: boolean

  @Field(() => Boolean, {
    nullable: true,
    description: 'Define if the query should return with the indicators or not',
  })
  public withIndicators?: boolean

  @Field(() => Boolean, {
    nullable: true,
    description: 'Define if the query should return all users of the team or just the default (10)',
  })
  public allUsers?: boolean
}
