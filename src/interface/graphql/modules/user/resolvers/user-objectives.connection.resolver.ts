import { UseGuards, UseInterceptors } from '@nestjs/common'
import { Resolver } from '@nestjs/graphql'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { ObjectiveInterface } from '@core/modules/objective/objective.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { GraphQLRequiredPoliciesGuard } from '@interface/graphql/authorization/guards/required-policies.guard'
import { GraphQLTokenGuard } from '@interface/graphql/authorization/guards/token.guard'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-connection.resolver'
import { NourishUserDataInterceptor } from '@interface/graphql/interceptors/nourish-user-data.interceptor'
import { ObjectiveGraphQLNode } from '@interface/graphql/objects/objective/objective.node'
import { UserObjectivesGraphQLConnection } from '@interface/graphql/objects/user/user-objectives.connection'

@UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard)
@UseInterceptors(NourishUserDataInterceptor)
@Resolver(() => UserObjectivesGraphQLConnection)
export class UserObjectivesConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  Objective,
  ObjectiveInterface,
  ObjectiveGraphQLNode
> {
  constructor(protected readonly core: CoreProvider) {
    super(Resource.OBJECTIVE, core, core.objective)
  }
}
