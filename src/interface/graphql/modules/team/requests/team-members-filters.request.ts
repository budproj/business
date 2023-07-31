import { ArgsType, Field } from '@nestjs/graphql'

import { SortingGraphQLEnum } from '@interface/graphql/enums/sorting.enum'

import { UserOrderInputObject } from '../../user/objects/user-order-input.object'
import { UserFiltersRequest } from '../../user/requests/user-filters.request'

@ArgsType()
export class TeamMembersFiltersRequest extends UserFiltersRequest {
  @Field({
    nullable: true,
    defaultValue: true,
    description: 'Define if we should resolve the entire team tree, showing all users below that team and subteams',
  })
  public resolveTree?: boolean

  @Field(() => UserOrderInputObject, {
    nullable: true,
    defaultValue: {
      firstName: SortingGraphQLEnum.ASC,
    },
    description: 'Define the expected order for our users connection edges',
  })
  public order?: UserOrderInputObject
}
