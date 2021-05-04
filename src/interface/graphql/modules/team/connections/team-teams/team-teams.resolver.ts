import { Resource } from '@adapters/authorization/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'

import { TeamGraphQLNode } from '../../team.node'

import { TeamTeamsGraphQLConnection } from './team-teams.connection'

@GuardedResolver(TeamTeamsGraphQLConnection)
export class TeamTeamsConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  Team,
  TeamInterface,
  TeamGraphQLNode
> {
  constructor(protected readonly core: CoreProvider) {
    super(Resource.TEAM, core, core.team)
  }
}
