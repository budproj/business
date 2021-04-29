import { ArgsType, Field } from '@nestjs/graphql'

import { SortingGraphQLEnum } from '@interface/graphql/enums/sorting.enum'
import { ConnectionFiltersRequest } from '@interface/graphql/requests/connection-filters.request'

import { UserOrderInputObject } from '../objects/user-order-input.object'

@ArgsType()
export class UserFiltersRequest extends ConnectionFiltersRequest<UserOrderInputObject> {
  @Field(() => UserOrderInputObject, {
    nullable: true,
    defaultValue: {
      firstName: SortingGraphQLEnum.DESC,
    },
    description: 'Define the expected order for our users connection edges',
  })
  public order?: UserOrderInputObject
}
