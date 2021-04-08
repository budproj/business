import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { CoreProvider } from '@core/core.provider'
import { GetOptions } from '@core/interfaces/get-options'
import { ObjectiveInterface } from '@core/modules/objective/objective.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { ObjectiveNodeGraphQLObject } from '@interface/graphql/objects/objetive/objective-node.object'
import { ObjectiveQueryResultGraphQLObject } from '@interface/graphql/objects/objetive/objective-query.object'
import { ObjectiveFiltersRequest } from '@interface/graphql/requests/objective/objective-filters.request'

import { CycleNodeGraphQLObject } from '../objects/cycle/cycle-node.object'
import { UserNodeGraphQLObject } from '../objects/user/user-node.object'

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
    super(Resource.TEAM, core, core.objective)
  }

  @RequiredActions('objective:read')
  @Query(() => ObjectiveQueryResultGraphQLObject, { name: 'objectives' })
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

    const response = this.marshalQueryResponse<ObjectiveNodeGraphQLObject>(queryResult)

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
}
