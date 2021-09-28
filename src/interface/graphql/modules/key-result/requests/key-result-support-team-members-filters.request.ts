import { ArgsType, Field } from '@nestjs/graphql'

import { SortingGraphQLEnum } from '@interface/graphql/enums/sorting.enum'
import { DefaultOrderGraphQLInput } from '@interface/graphql/objects/default-order.object'
import { ConnectionFiltersRequest } from '@interface/graphql/requests/connection-filters.request'

@ArgsType()
export class KeyResultSupportTeamMembersFiltersRequest extends ConnectionFiltersRequest {

  @Field(() => DefaultOrderGraphQLInput, {
    nullable: true,
    defaultValue: {
      createdAt: SortingGraphQLEnum.ASC,
    },
    description: 'Define the expected order for our key-result edges',
  })
  public order?: DefaultOrderGraphQLInput
}
