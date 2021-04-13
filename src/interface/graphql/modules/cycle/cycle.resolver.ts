import { Logger } from '@nestjs/common'
import { Args, Parent, ResolveField } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { AuthorizedRequestUser } from '@interface/graphql/authorization/decorators/authorized-request-user.decorator'
import { GuardedQuery } from '@interface/graphql/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-node.resolver'
import { KeyResultGraphQLNode } from '@interface/graphql/modules/key-result/key-result.node'
import { KeyResultFiltersRequest } from '@interface/graphql/modules/key-result/requests/key-result-filters.request'
import { ObjectivesGraphQLConnection } from '@interface/graphql/modules/objective/connections/objectives/objectives.connection'
import { ObjectiveFiltersRequest } from '@interface/graphql/modules/objective/requests/objective-filters.request'
import { TeamGraphQLNode } from '@interface/graphql/modules/team/team.node'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'

import { CycleCyclesGraphQLConnection } from './connections/cycle-cycles/cycle-cycles.connection'
import { CyclesGraphQLConnection } from './connections/cycles/cycles.connection'
import { CycleGraphQLNode } from './cycle.node'
import { CycleStatusObject } from './objects/cycle-status.object'
import { CycleFiltersRequest } from './requests/cycle-filters.request'
import { CyclesInSamePeriodRequest } from './requests/cycles-in-same-period.request'

@GuardedResolver(CycleGraphQLNode)
export class CycleGraphQLResolver extends GuardedNodeGraphQLResolver<Cycle, CycleInterface> {
  private readonly logger = new Logger(CycleGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.CYCLE, core, core.cycle)
  }

  @GuardedQuery(CycleGraphQLNode, 'cycle:read', { name: 'cycle' })
  protected async getCycleForRequestAndAuthorizedRequestUser(
    @Args() request: NodeIndexesRequest,
    @AuthorizedRequestUser() authorizationUser: AuthorizationUser,
  ) {
    this.logger.log({
      request,
      message: 'Fetching cycle with provided indexes',
    })

    const cycle = await this.queryGuard.getOneWithActionScopeConstraint(request, authorizationUser)
    if (!cycle) throw new UserInputError(`We could not found a cycle with the provided arguments`)

    return cycle
  }

  @GuardedQuery(CyclesGraphQLConnection, 'cycle:read', { name: 'cyclesInSamePeriod' })
  protected async getCyclesInSamePeriodForRequestAndAuthorizedRequestUser(
    @Args() request: CyclesInSamePeriodRequest,
    @AuthorizedRequestUser() authorizationUser: AuthorizationUser,
  ) {
    this.logger.log({
      request,
      message: 'Fetching cycles in same period',
    })

    const [{ fromCycles, ...filters }, queryOptions, connection] = this.relay.unmarshalRequest<
      CyclesInSamePeriodRequest,
      Cycle
    >(request)

    const userTeamsTree = await this.core.team.getTeamNodesTreeBeforeTeam(authorizationUser.teams)
    const queryResult = await this.core.cycle.getCyclesInSamePeriodFromTeamsAndParentIDsWithFilters(
      userTeamsTree,
      fromCycles,
      filters,
      queryOptions,
    )

    return this.relay.marshalResponse<Cycle>(queryResult, connection)
  }

  @ResolveField('status', () => CycleStatusObject)
  protected async getStatusForCycle(@Parent() cycle: CycleGraphQLNode) {
    this.logger.log({
      cycle,
      message: 'Fetching current status for this cycle',
    })

    const status = await this.core.cycle.getCurrentStatus(cycle)

    return status
  }

  @ResolveField('team', () => TeamGraphQLNode)
  protected async getTeamForCycle(@Parent() cycle: CycleGraphQLNode) {
    this.logger.log({
      cycle,
      message: 'Fetching team for cycle',
    })

    const team = await this.core.team.getOne({ id: cycle.teamId })

    return team
  }

  @ResolveField('objectives', () => ObjectivesGraphQLConnection, { nullable: true })
  protected async getObjectivesForCycle(
    @Args() request: ObjectiveFiltersRequest,
    @Parent() cycle: CycleGraphQLNode,
  ) {
    this.logger.log({
      cycle,
      request,
      message: 'Fetching objectives for cycle',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      ObjectiveFiltersRequest,
      Objective
    >(request)

    const queryResult = await this.core.objective.getFromCycle(cycle, filters, queryOptions)

    return this.relay.marshalResponse<ObjectiveInterface>(queryResult, connection)
  }

  @ResolveField('parent', () => CycleGraphQLNode, { nullable: true })
  protected async getParentCycleForCycle(@Parent() cycle: CycleGraphQLNode) {
    this.logger.log({
      cycle,
      message: 'Fetching parent cycle for cycle',
    })

    const parentCycle = await this.core.cycle.getOne({ id: cycle.parentId })

    return parentCycle
  }

  @ResolveField('cycles', () => CycleCyclesGraphQLConnection, { nullable: true })
  protected async getChildCyclesForRequestAndCycle(
    @Args() request: CycleFiltersRequest,
    @Parent() cycle: CycleGraphQLNode,
  ) {
    this.logger.log({
      cycle,
      request,
      message: 'Fetching child cycles for cycle',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      CycleFiltersRequest,
      Cycle
    >(request)

    const childCycles = await this.core.cycle.getChildCycles(cycle, filters, queryOptions)
    const sortedByCadenceChildCycles = this.core.cycle.sortCyclesByCadence(childCycles)

    return this.relay.marshalResponse<CycleInterface>(sortedByCadenceChildCycles, connection)
  }

  @ResolveField('keyResults', () => [KeyResultGraphQLNode], { nullable: true })
  protected async getKeyResultsForRequestAndCycle(
    @Args() request: KeyResultFiltersRequest,
    @Parent() cycle: CycleGraphQLNode,
  ) {
    this.logger.log({
      request,
      cycle,
      message: 'Fetching key results for cycle',
    })

    const [filters, queryOptions] = this.relay.unmarshalRequest<KeyResultFiltersRequest, Cycle>(
      request,
    )

    const objectives = await this.core.objective.getFromCycle(cycle)
    const keyResults = await this.core.keyResult.getFromObjectives(
      objectives,
      filters,
      queryOptions,
    )

    return keyResults
  }
}
