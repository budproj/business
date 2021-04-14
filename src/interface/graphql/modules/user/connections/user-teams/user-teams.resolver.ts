import { Resource } from '@adapters/authorization/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { GuardedResolver } from '@interface/graphql/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-connection.resolver'
import { TeamGraphQLNode } from '@interface/graphql/modules/team/team.node'

import { UserTeamsGraphQLConnection } from './user-teams.connection'

@GuardedResolver(UserTeamsGraphQLConnection)
export class UserTeamsConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  Team,
  TeamInterface,
  TeamGraphQLNode
> {
  constructor(protected readonly core: CoreProvider) {
    super(Resource.TEAM, core, core.team)
  }
}
