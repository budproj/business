import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { CoreProvider } from '@core/core.provider'
import { GetOptions } from '@core/interfaces/get-options'
import { ObjectiveInterface } from '@core/modules/objective/objective.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { GraphQLRequiredPoliciesGuard } from '@interface/graphql/authorization/guards/required-policies.guard'
import { GraphQLTokenGuard } from '@interface/graphql/authorization/guards/token.guard'
import { CycleGraphQLNode } from '@interface/graphql/objects/cycle/cycle.node'
import { KeyResultGraphQLNode } from '@interface/graphql/objects/key-result/key-result.node'
import { ObjectiveGraphQLNode } from '@interface/graphql/objects/objective/objective.node'
import { ObjectivesGraphQLConnection } from '@interface/graphql/objects/objective/objectives.connection'
import { UserGraphQLNode } from '@interface/graphql/objects/user/user.node'
import { BaseGraphQLResolver } from '@interface/graphql/resolvers/base.resolver'
import { GraphQLUser } from '@interface/graphql/resolvers/decorators/graphql-user'
import { NourishUserDataInterceptor } from '@interface/graphql/resolvers/interceptors/nourish-user-data.interceptor'

import { ObjectiveFiltersRequest } from '../requests/objective-filters.request'

@UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard)
@UseInterceptors(NourishUserDataInterceptor)
@Resolver(() => ObjectiveGraphQLNode)
export class ObjectiveGraphQLResolver extends BaseGraphQLResolver<Objective, ObjectiveInterface> {
  private readonly logger = new Logger(ObjectiveGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.OBJECTIVE, core, core.objective)
  }

  @RequiredActions('objective:read')
  @Query(() => ObjectivesGraphQLConnection, { name: 'objectives' })
  protected async getObjectives(
    @Args() request: ObjectiveFiltersRequest,
    @GraphQLUser() graphqlUser: AuthorizationUser,
  ) {
    this.logger.log({
      request,
      graphqlUser,
      message: 'Fetching objectives with filters',
    })

    const [connection, filters] = this.relay.unmarshalRequest(request)

    const queryOptions: GetOptions<Objective> = {
      limit: connection.first,
    }
    const queryResult = await this.queryGuard.getManyWithActionScopeConstraint(
      filters,
      graphqlUser,
      queryOptions,
    )

    return this.relay.marshalResponse<ObjectiveGraphQLNode>(queryResult, connection)
  }

  @ResolveField('owner', () => UserGraphQLNode)
  protected async getObjectiveOwner(@Parent() objective: ObjectiveGraphQLNode) {
    this.logger.log({
      objective,
      message: 'Fetching owner for objective',
    })

    return this.core.user.getOne({ id: objective.ownerId })
  }

  @ResolveField('cycle', () => CycleGraphQLNode)
  protected async getObjectiveCycle(@Parent() objective: ObjectiveGraphQLNode) {
    this.logger.log({
      objective,
      message: 'Fetching cycle for objective',
    })

    return this.core.cycle.getFromObjective(objective)
  }

  @ResolveField('keyResults', () => [KeyResultGraphQLNode], { nullable: true })
  protected async getObjectiveKeyResults(@Parent() objective: ObjectiveGraphQLNode) {
    this.logger.log({
      objective,
      message: 'Fetching key results for objective',
    })

    return this.core.keyResult.getFromObjective(objective)
  }
}
