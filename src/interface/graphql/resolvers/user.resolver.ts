import { Logger, UseGuards } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { UserGraphQLObject } from '@interface/graphql/objects/user.object'
import { UserFiltersRequest } from '@interface/graphql/requests/user/user-filters.request'
import { UsersGraphQLResponse } from '@interface/graphql/responses/users.response'

import { GraphQLRequiredPoliciesGuard } from './guards/required-policies.guard'
import { GraphQLTokenGuard } from './guards/token.guard'

@UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard)
@Resolver(() => UserGraphQLObject)
export class UserGraphQLResolver {
  private readonly logger = new Logger(UserGraphQLResolver.name)

  @RequiredActions('user:read')
  @Query(() => UsersGraphQLResponse, { name: 'users' })
  protected async getUsers(@Args() filters: UserFiltersRequest) {
    this.logger.log({
      filters,
      message: 'Fetching user with filters',
    })

    return {}
  }
}
