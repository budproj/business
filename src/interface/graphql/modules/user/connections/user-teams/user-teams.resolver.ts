import { Resource } from '@adapters/policy/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'

import { UserTeamsGraphQLConnection } from './user-teams.connection'

@GuardedResolver(UserTeamsGraphQLConnection)
export class UserTeamsConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  Team,
  TeamInterface
> {
  constructor(protected readonly core: CoreProvider) {
    super(Resource.TEAM, core, core.team)
  }
}
