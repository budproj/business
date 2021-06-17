import { Logger } from '@nestjs/common'
import { Args, Parent, ResolveField } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { Status } from '@core/interfaces/status.interface'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-node.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'
import { KeyResultFiltersRequest } from '@interface/graphql/modules/key-result/requests/key-result-filters.request'
import { ObjectivesGraphQLConnection } from '@interface/graphql/modules/objective/connections/objectives/objectives.connection'
import { ObjectiveFiltersRequest } from '@interface/graphql/modules/objective/requests/objective-filters.request'
import { TeamGraphQLNode } from '@interface/graphql/modules/team/team.node'
import { StatusGraphQLObject } from '@interface/graphql/objects/status.object'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'
import { StatusGroupRequest } from '@interface/graphql/requests/status.request'

import { CycleCyclesGraphQLConnection } from './connections/cycle-cycles/cycle-cycles.connection'
import { CycleKeyResultsGraphQLConnection } from './connections/cycle-key-results/cycle-key-results.connection'
import { CyclesGraphQLConnection } from './connections/cycles/cycles.connection'
import { CycleGraphQLNode } from './cycle.node'
import { CycleFiltersRequest } from './requests/cycle-filters.request'
import { CyclesInSamePeriodRequest } from './requests/cycles-in-same-period.request'

@GuardedResolver(CycleGraphQLNode)
export class CycleGraphQLResolver extends GuardedNodeGraphQLResolver<Cycle, CycleInterface> {
  private readonly logger = new Logger(CycleGraphQLResolver.name)

  constructor(
    protected readonly core: CoreProvider,
    protected readonly corePorts: CorePortsProvider,
  ) {
    super(Resource.CYCLE, core, core.cycle)
  }

  @GuardedQuery(CycleGraphQLNode, 'cycle:read', { name: 'cycle' })
  protected async getCycleForRequestAndRequestUserWithContext(
    @Args() request: NodeIndexesRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    this.logger.log({
      request,
      message: 'Fetching cycle with provided indexes',
    })

    const cycle = await this.queryGuard.getOneWithActionScopeConstraint(request, userWithContext)
    if (!cycle) throw new UserInputError(`We could not found a cycle with the provided arguments`)

    return cycle
  }

  @GuardedQuery(CyclesGraphQLConnection, 'cycle:read', { name: 'cyclesInSamePeriod' })
  protected async getCyclesInSamePeriodForRequestAndRequestUserWithContext(
    @Args() request: CyclesInSamePeriodRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    this.logger.log({
      request,
      message: 'Fetching cycles in same period',
    })

    const [{ fromCycles, ...filters }, queryOptions, connection] = this.relay.unmarshalRequest<
      CyclesInSamePeriodRequest,
      Cycle
    >(request)

    const userTeamsTree = await this.core.team.getTeamNodesTreeBeforeTeam(userWithContext.teams)
    const queryResult = await this.core.cycle.getCyclesInSamePeriodFromTeamsAndParentIDsWithFilters(
      userTeamsTree,
      fromCycles,
      filters,
      queryOptions,
    )

    return this.relay.marshalResponse<Cycle>(queryResult, connection)
  }

  @ResolveField('status', () => StatusGraphQLObject)
  protected async getStatusForCycle(
    @Parent() cycle: CycleGraphQLNode,
    @Args() request: StatusGroupRequest,
  ) {
    this.logger.log({
      cycle,
      request,
      message: 'Fetching current status for this cycle',
    })

    const result = await this.corePorts.dispatchCommand<Status>(
      'get-cycle-status',
      cycle.id,
      request,
    )
    if (!result)
      throw new UserInputError(`We could not find status for the cycle with ID ${cycle.id}`)

    return result
  }

  @ResolveField('team', () => TeamGraphQLNode)
  protected async getTeamForCycle(@Parent() cycle: CycleGraphQLNode) {
    this.logger.log({
      cycle,
      message: 'Fetching team for cycle',
    })

    return this.core.team.getOne({ id: cycle.teamId })
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

    return this.relay.marshalResponse<ObjectiveInterface>(queryResult, connection, cycle)
  }

  @ResolveField('parent', () => CycleGraphQLNode, { nullable: true })
  protected async getParentCycleForCycle(@Parent() cycle: CycleGraphQLNode) {
    this.logger.log({
      cycle,
      message: 'Fetching parent cycle for cycle',
    })

    return this.core.cycle.getOne({ id: cycle.parentId })
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

    return this.relay.marshalResponse<CycleInterface>(sortedByCadenceChildCycles, connection, cycle)
  }

  @ResolveField('keyResults', () => CycleKeyResultsGraphQLConnection, { nullable: true })
  protected async getKeyResultsForRequestAndCycle(
    @Args() request: KeyResultFiltersRequest,
    @Parent() cycle: CycleGraphQLNode,
  ) {
    this.logger.log({
      request,
      cycle,
      message: 'Fetching key results for cycle',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      KeyResultFiltersRequest,
      KeyResult
    >(request)

    const objectives = await this.core.objective.getFromCycle(cycle)
    const keyResults = await this.core.keyResult.getFromObjectives(
      objectives,
      filters,
      queryOptions,
    )

    return this.relay.marshalResponse<KeyResultInterface>(keyResults, connection, cycle)
  }
}
