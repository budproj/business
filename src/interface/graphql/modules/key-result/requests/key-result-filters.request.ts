import { ArgsType, Field, ID } from '@nestjs/graphql'

import { SortingGraphQLEnum } from '@interface/graphql/enums/sorting.enum'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'
import { DefaultOrderGraphQLInput } from '@interface/graphql/objects/default-order.object'
import { ConnectionFiltersRequest } from '@interface/graphql/requests/connection-filters.request'

@ArgsType()
export class KeyResultFiltersRequest extends ConnectionFiltersRequest {
  @Field(() => ID, {
    description: 'The user ID that should owns the key results you are trying to fetch',
    nullable: true,
  })
  public readonly ownerId?: UserGraphQLNode['id']

  @Field(() => DefaultOrderGraphQLInput, {
    nullable: true,
    defaultValue: {
      createdAt: SortingGraphQLEnum.ASC,
    },
    description: 'Define the expected order for our key-result edges',
  })
  public order?: DefaultOrderGraphQLInput

  // @Field(() => Boolean, {
  //   description: 'Define if the query user wants only active or all key results',
  //   nullable: true,
  //   defaultValue: true,
  // })
  // public active?: boolean

  // @Field(() => Number, {
  //   description: 'Define the confidence of the key results',
  //   nullable: true,
  //   defaultValue: undefined,
  // })
  // public confidence?: number
}
