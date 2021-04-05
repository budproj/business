import { Logger } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import { UserGraphQLObject } from '@interface/graphql/objects/user.object'
import { UserFiltersRequest } from '@interface/graphql/requests/user/user-filters.request'
import { UsersGraphQLResponse } from '@interface/graphql/responses/users.response'

@Resolver(() => UserGraphQLObject)
export class UserGraphQLResolver {
  private readonly logger = new Logger(UserGraphQLResolver.name)

  @Query(() => UsersGraphQLResponse, { name: 'users' })
  protected async getUsers(@Args() filters: UserFiltersRequest) {
    this.logger.log({
      filters,
      message: 'Fetching user with filters',
    })

    return {}
  }
}
