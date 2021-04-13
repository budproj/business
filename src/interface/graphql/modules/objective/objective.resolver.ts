import { Logger } from '@nestjs/common'
import { Args, Float, Parent, ResolveField } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { AuthorizedRequestUser } from '@interface/graphql/authorization/decorators/authorized-request-user.decorator'
import { GuardedQuery } from '@interface/graphql/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-node.resolver'
import { CycleGraphQLNode } from '@interface/graphql/modules/cycle/cycle.node'
import { KeyResultGraphQLNode } from '@interface/graphql/modules/key-result/key-result.node'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'

import { ObjectivesGraphQLConnection } from './connections/objectives/objectives.connection'
import { ObjectiveGraphQLNode } from './objective.node'
import { ObjectiveStatusObject } from './objects/objective-status.object'
import { ObjectiveFiltersRequest } from './requests/objective-filters.request'

@GuardedResolver(ObjectiveGraphQLNode)
export class ObjectiveGraphQLResolver extends GuardedNodeGraphQLResolver<
  Objective,
  ObjectiveInterface
> {
  private readonly logger = new Logger(ObjectiveGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.OBJECTIVE, core, core.objective)
  }

  @GuardedQuery(ObjectiveGraphQLNode, 'objective:read', { name: 'objective' })
  protected async getObjectiveForRequestAndAuthorizedRequestUser(
    @Args() request: NodeIndexesRequest,
    @AuthorizedRequestUser() authorizationUser: AuthorizationUser,
  ) {
    this.logger.log({
      request,
      message: 'Fetching objective with provided indexes',
    })

    const objective = await this.queryGuard.getOneWithActionScopeConstraint(
      request,
      authorizationUser,
    )
    if (!objective)
      throw new UserInputError(`We could not found an objective with the provided arguments`)

    return objective
  }

  @GuardedQuery(ObjectivesGraphQLConnection, 'objective:read', { name: 'objectives' })
  protected async getObjectivesForRequestAndAuthorizedRequestUser(
    @Args() request: ObjectiveFiltersRequest,
    @AuthorizedRequestUser() authorizationUser: AuthorizationUser,
  ) {
    this.logger.log({
      request,
      authorizationUser,
      message: 'Fetching objectives with filters',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      ObjectiveFiltersRequest,
      Objective
    >(request)

    const queryResult = await this.queryGuard.getManyWithActionScopeConstraint(
      filters,
      authorizationUser,
      queryOptions,
    )

    return this.relay.marshalResponse<Objective>(queryResult, connection)
  }

  @ResolveField('owner', () => UserGraphQLNode)
  protected async getOwnerForObjective(@Parent() objective: ObjectiveGraphQLNode) {
    this.logger.log({
      objective,
      message: 'Fetching owner for objective',
    })

    return this.core.user.getOne({ id: objective.ownerId })
  }

  @ResolveField('cycle', () => CycleGraphQLNode)
  protected async getCycleForObjective(@Parent() objective: ObjectiveGraphQLNode) {
    this.logger.log({
      objective,
      message: 'Fetching cycle for objective',
    })

    return this.core.cycle.getFromObjective(objective)
  }

  @ResolveField('keyResults', () => [KeyResultGraphQLNode], { nullable: true })
  protected async getKeyResultsForObjective(@Parent() objective: ObjectiveGraphQLNode) {
    this.logger.log({
      objective,
      message: 'Fetching key results for objective',
    })

    return this.core.keyResult.getFromObjective(objective)
  }

  @ResolveField('status', () => ObjectiveStatusObject)
  protected async getStatusForObjective(@Parent() objective: ObjectiveGraphQLNode) {
    this.logger.log({
      objective,
      message: 'Fetching current status for objective',
    })

    return this.core.objective.getCurrentStatus(objective)
  }

  @ResolveField('progressIncreaseSinceLastWeek', () => Float)
  protected async getProgressIncreaseSinceLastWeekForObjective(
    @Parent() objective: ObjectiveGraphQLNode,
  ) {
    this.logger.log({
      objective,
      message: 'Fetching progress increase for objective since last week',
    })

    return this.core.objective.getObjectiveProgressIncreaseSinceLastWeek(objective)
  }
}
