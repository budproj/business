import { Resource } from '@adapters/policy/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { UserInterface } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'
import { UserAccessControl } from '@interface/graphql/modules/user/user.access-control'

import { TeamUsersGraphQLConnection } from './team-users.connection'

@GuardedResolver(TeamUsersGraphQLConnection)
export class TeamUsersConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<User, UserInterface> {
  constructor(protected readonly core: CoreProvider, accessControl: UserAccessControl) {
    super(Resource.USER, core, core.user, accessControl)
  }
}
