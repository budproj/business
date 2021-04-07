import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { CoreProvider } from '@core/core.provider'
import { UserInterface } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'
import { UsersQueryResultGraphQLObject } from '@interface/graphql/objects/user-query.object'
import { UserGraphQLObject } from '@interface/graphql/objects/user.object'
import { UserFiltersRequest } from '@interface/graphql/requests/user/user-filters.request'

import { BaseGraphQLResolver } from './base.resolver'
import { GraphQLUser } from './decorators/graphql-user'
import { GraphQLRequiredPoliciesGuard } from './guards/required-policies.guard'
import { GraphQLTokenGuard } from './guards/token.guard'
import { NourishUserDataInterceptor } from './interceptors/nourish-user-data.interceptor'

@UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard)
@UseInterceptors(NourishUserDataInterceptor)
@Resolver(() => UserGraphQLObject)
export class UserGraphQLResolver extends BaseGraphQLResolver<User, UserInterface> {
  private readonly logger = new Logger(UserGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.USER, core, core.user)
  }

  @RequiredActions('user:read')
  @Query(() => UsersQueryResultGraphQLObject, { name: 'users' })
  protected async getUsers(
    @Args() filters: UserFiltersRequest,
    @GraphQLUser() graphqlUser: AuthorizationUser,
  ) {
    this.logger.log({
      filters,
      graphqlUser,
      message: 'Fetching user with filters',
    })

    const selectedUsers = await this.queryGuard.getManyWithActionScopeConstraint(
      filters,
      graphqlUser,
    )

    const queryResult = this.marshalQueryResult(selectedUsers)

    return queryResult
  }
}
