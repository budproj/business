import { Resource } from '@adapters/authorization/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { UserInterface } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'
import { GuardedResolver } from '@interface/graphql/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-connection.resolver'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'

import { TeamUsersGraphQLConnection } from './team-users.connection'

@GuardedResolver(TeamUsersGraphQLConnection)
export class TeamUsersConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  User,
  UserInterface,
  UserGraphQLNode
> {
  constructor(protected readonly core: CoreProvider) {
    super(Resource.USER, core, core.user)
  }
}
