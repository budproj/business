import { Resource } from '@adapters/authorization/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { ObjectiveInterface } from '@core/modules/objective/objective.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { GuardedResolver } from '@interface/graphql/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-connection.resolver'
import { ObjectiveGraphQLNode } from '@interface/graphql/objects/objective/objective.node'
import { UserObjectivesGraphQLConnection } from '@interface/graphql/objects/user/user-objectives.connection'

@GuardedResolver(UserObjectivesGraphQLConnection)
export class UserObjectivesConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  Objective,
  ObjectiveInterface,
  ObjectiveGraphQLNode
> {
  constructor(protected readonly core: CoreProvider) {
    super(Resource.OBJECTIVE, core, core.objective)
  }
}
