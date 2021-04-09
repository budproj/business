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
import { CycleGraphQLNode } from '@interface/graphql/nodes/cycle.node'
import { KeyResultGraphQLNode } from '@interface/graphql/nodes/key-result.node'
import { ObjectiveGraphQLNode } from '@interface/graphql/nodes/objective.node'
import { UserGraphQLNode } from '@interface/graphql/nodes/user.node'
import { BaseGraphQLResolver } from '@interface/graphql/resolvers/base.resolver'
import { GraphQLUser } from '@interface/graphql/resolvers/decorators/graphql-user'
import { NourishUserDataInterceptor } from '@interface/graphql/resolvers/interceptors/nourish-user-data.interceptor'

import { ObjectiveListGraphQLObject } from '../objects/objective-list.object'
import { ObjectiveFiltersRequest } from '../requests/objective-filters.request'
import { ObjectiveRootEdgeGraphQLResponse } from '../responses/objective-root-edge.response'

@UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard)
@UseInterceptors(NourishUserDataInterceptor)
@Resolver(() => ObjectiveGraphQLNode)
export class ObjectiveGraphQLResolver extends BaseGraphQLResolver<Objective, ObjectiveInterface> {
  private readonly logger = new Logger(ObjectiveGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.OBJECTIVE, core, core.objective)
  }

  @RequiredActions('objective:read')
  @Query(() => ObjectiveListGraphQLObject, { name: 'objectives' })
  protected async getObjectives(
    @Args() { first, ...filters }: ObjectiveFiltersRequest,
    @GraphQLUser() graphqlUser: AuthorizationUser,
  ) {
    this.logger.log({
      first,
      filters,
      graphqlUser,
      message: 'Fetching objectives with filters',
    })

    const queryOptions: GetOptions<Objective> = {
      limit: first,
    }
    const queryResult = await this.queryGuard.getManyWithActionScopeConstraint(
      filters,
      graphqlUser,
      queryOptions,
    )

    const edges = queryResult?.map((node) => new ObjectiveRootEdgeGraphQLResponse({ node }))
    const response = this.marshalListResponse<ObjectiveRootEdgeGraphQLResponse>(edges)

    return response
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
