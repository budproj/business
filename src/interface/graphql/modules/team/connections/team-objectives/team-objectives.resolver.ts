import { Resource } from '@adapters/policy/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'
import { ObjectiveBaseAccessControl } from '@interface/graphql/modules/objective/access-control/base.access-control'

import { TeamObjectivesGraphQLConnection } from './team-objectives.connection'

@GuardedResolver(TeamObjectivesGraphQLConnection)
export class TeamObjectivesConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  Objective,
  ObjectiveInterface
> {
  constructor(protected readonly core: CoreProvider, accessControl: ObjectiveBaseAccessControl) {
    super(Resource.OBJECTIVE, core, core.objective, accessControl)
  }
}
