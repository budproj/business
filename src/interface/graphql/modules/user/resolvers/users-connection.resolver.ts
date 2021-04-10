import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Resolver } from '@nestjs/graphql'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { User } from '@core/modules/user/user.orm-entity'
import { GraphQLRequiredPoliciesGuard } from '@interface/graphql/authorization/guards/required-policies.guard'
import { GraphQLTokenGuard } from '@interface/graphql/authorization/guards/token.guard'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-connection.resolver'
import { UsersGraphQLConnection } from '@interface/graphql/objects/user/users.connection'
import { NourishUserDataInterceptor } from '@interface/graphql/resolvers/interceptors/nourish-user-data.interceptor'

@UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard)
@UseInterceptors(NourishUserDataInterceptor)
@Resolver(() => UsersGraphQLConnection)
export class UsersConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<User> {
  private readonly logger = new Logger(UsersConnectionGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.USER, core)
  }
}
