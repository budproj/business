import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Query, Resolver } from '@nestjs/graphql'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { CoreProvider } from '@core/core.provider'
import { UserInterface } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'
import { AuthorizedRequestUser } from '@interface/graphql/authorization/decorators/authorized-request-user.decorator'
import { GraphQLRequiredPoliciesGuard } from '@interface/graphql/authorization/guards/required-policies.guard'
import { GraphQLTokenGuard } from '@interface/graphql/authorization/guards/token.guard'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-connection.resolver'
import { NourishUserDataInterceptor } from '@interface/graphql/interceptors/nourish-user-data.interceptor'
import { UserGraphQLNode } from '@interface/graphql/objects/user/user.node'
import { UsersGraphQLConnection } from '@interface/graphql/objects/user/users.connection'

import { UserFiltersRequest } from '../requests/user-filters.request'

@UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard)
@UseInterceptors(NourishUserDataInterceptor)
@Resolver(() => UsersGraphQLConnection)
export class UsersConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  User,
  UserInterface,
  UserGraphQLNode
> {
  private readonly logger = new Logger(UsersConnectionGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.USER, core, core.user)
  }

  @RequiredActions('user:read')
  @Query(() => UsersGraphQLConnection, { name: 'users' })
  protected async getUsers(
    @Args() request: UserFiltersRequest,
    @AuthorizedRequestUser() authorizedRequestUser: AuthorizationUser,
  ) {
    this.logger.log({
      request,
      authorizedRequestUser,
      message: 'Fetching users with filters',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      UserFiltersRequest,
      User
    >(request)

    const queryResult = await this.queryGuard.getManyWithActionScopeConstraint(
      filters,
      authorizedRequestUser,
      queryOptions,
    )

    return this.relay.marshalResponse<User>(queryResult, connection)
  }
}
