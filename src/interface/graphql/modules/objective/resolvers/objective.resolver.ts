import { Logger } from '@nestjs/common'
import { Args, Parent, ResolveField } from '@nestjs/graphql'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { AuthorizedRequestUser } from '@interface/graphql/authorization/decorators/authorized-request-user.decorator'
import { GuardedQuery } from '@interface/graphql/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-node.resolver'
import { CycleGraphQLNode } from '@interface/graphql/objects/cycle/cycle.node'
import { KeyResultGraphQLNode } from '@interface/graphql/objects/key-result/key-result.node'
import { ObjectiveStatusObject } from '@interface/graphql/objects/objective/objective-status.object'
import { ObjectiveGraphQLNode } from '@interface/graphql/objects/objective/objective.node'
import { ObjectivesGraphQLConnection } from '@interface/graphql/objects/objective/objectives.connection'
import { UserGraphQLNode } from '@interface/graphql/objects/user/user.node'

import { ObjectiveFiltersRequest } from '../requests/objective-filters.request'

@GuardedResolver(ObjectiveGraphQLNode)
export class ObjectiveGraphQLResolver extends GuardedNodeGraphQLResolver<
  Objective,
  ObjectiveInterface
> {
  private readonly logger = new Logger(ObjectiveGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.OBJECTIVE, core, core.objective)
  }

  @GuardedQuery(ObjectivesGraphQLConnection, 'objective:read', { name: 'objectives' })
  protected async getObjectives(
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

  @ResolveField('status', () => ObjectiveStatusObject)
  protected async getObjectiveStatus(@Parent() objective: ObjectiveGraphQLNode) {
    this.logger.log({
      objective,
      message: 'Fetching current status for objective',
    })

    return this.core.objective.getCurrentStatus(objective)
  }
}
