import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { CoreProvider } from '@core/core.provider'
import { GetOptions } from '@core/interfaces/get-options'
import { ObjectiveInterface } from '@core/modules/objective/objective.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'

import { CycleNodeGraphQLObject } from '../objects/cycle/cycle-node.object'
import { KeyResultNodeGraphQLObject } from '../objects/key-result/key-result-node.object'
import { ObjectiveListGraphQLObject } from '../objects/objetive/objective-list.object'
import { ObjectiveNodeGraphQLObject } from '../objects/objetive/objective-node.object'
import { UserNodeGraphQLObject } from '../objects/user/user-node.object'
import { ObjectiveFiltersRequest } from '../requests/objective/objective-filters.request'
import { ObjectiveRootEdgeGraphQLResponse } from '../responses/objective/objective-root-edge.response'

import { BaseGraphQLResolver } from './base.resolver'
import { GraphQLUser } from './decorators/graphql-user'
import { GraphQLRequiredPoliciesGuard } from './guards/required-policies.guard'
import { GraphQLTokenGuard } from './guards/token.guard'
import { NourishUserDataInterceptor } from './interceptors/nourish-user-data.interceptor'

@UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard)
@UseInterceptors(NourishUserDataInterceptor)
@Resolver(() => ObjectiveNodeGraphQLObject)
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

  @ResolveField('owner', () => UserNodeGraphQLObject)
  protected async getObjectiveOwner(@Parent() objective: ObjectiveNodeGraphQLObject) {
    this.logger.log({
      objective,
      message: 'Fetching owner for objective',
    })

    return this.core.user.getOne({ id: objective.ownerId })
  }

  @ResolveField('cycle', () => CycleNodeGraphQLObject)
  protected async getObjectiveCycle(@Parent() objective: ObjectiveNodeGraphQLObject) {
    this.logger.log({
      objective,
      message: 'Fetching cycle for objective',
    })

    return this.core.cycle.getFromObjective(objective)
  }

  @ResolveField('keyResults', () => [KeyResultNodeGraphQLObject], { nullable: true })
  protected async getObjectiveKeyResults(@Parent() objective: ObjectiveNodeGraphQLObject) {
    this.logger.log({
      objective,
      message: 'Fetching key results for objective',
    })

    return this.core.keyResult.getFromObjective(objective)
  }
}
