import { Logger, UnauthorizedException } from '@nestjs/common'
import { Args, Parent, ResolveField } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'
import { startOfWeek } from 'date-fns'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { CycleStatusProvider } from '@core/modules/mission-control/status/cycle/cycle-status.provider'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { GuardedMutation } from '@interface/graphql/adapters/authorization/decorators/guarded-mutation.decorator'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-node.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'
import { KeyResultFiltersRequest } from '@interface/graphql/modules/key-result/requests/key-result-filters.request'
import { ObjectivesGraphQLConnection } from '@interface/graphql/modules/objective/connections/objectives/objectives.connection'
import { ObjectiveFiltersRequest } from '@interface/graphql/modules/objective/requests/objective-filters.request'
import { TeamGraphQLNode } from '@interface/graphql/modules/team/team.node'
import { DeleteResultGraphQLObject } from '@interface/graphql/objects/delete-result.object'
import { DeltaGraphQLObject } from '@interface/graphql/objects/delta.object'
import { StatusGraphQLObject } from '@interface/graphql/objects/status.object'
import { NodeDeleteRequest } from '@interface/graphql/requests/node-delete.request'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'
import { StatusRequest } from '@interface/graphql/requests/status.request'
import { Cacheable } from '@lib/cache/cacheable.decorator'
import { Stopwatch } from '@lib/logger/pino.decorator'

import { CycleAccessControl } from './access-control/cycle.access-control'
import { CycleCyclesGraphQLConnection } from './connections/cycle-cycles/cycle-cycles.connection'
import { CycleKeyResultsGraphQLConnection } from './connections/cycle-key-results/cycle-key-results.connection'
import { CyclesGraphQLConnection } from './connections/cycles/cycles.connection'
import { CycleGraphQLNode } from './cycle.node'
import { CycleCreateRequest } from './requests/cycle-create-request'
import { CycleFiltersRequest } from './requests/cycle-filters.request'
import { CycleUpdateRequest } from './requests/cycle-update.request'
import { CyclesInSamePeriodRequest } from './requests/cycles-in-same-period.request'

@GuardedResolver(CycleGraphQLNode)
export class CycleGraphQLResolver extends GuardedNodeGraphQLResolver<Cycle, CycleInterface> {
  private readonly logger = new Logger(CycleGraphQLResolver.name)

  constructor(
    protected readonly core: CoreProvider,
    protected readonly corePorts: CorePortsProvider,
    protected readonly accessControl: CycleAccessControl,
    private readonly cycleStatusProvider: CycleStatusProvider,
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

    const userTeamsTree = await this.core.team.getAscendantsByIds(
      userWithContext.teams.map(({ id }) => id),
      {},
    )
    const queryResult = await this.core.cycle.getCyclesInSamePeriodFromTeamsAndParentIDsWithFilters(
      userTeamsTree,
      fromCycles,
      filters,
      queryOptions,
    )

    return this.relay.marshalResponse<Cycle>(queryResult, connection)
  }

  @ResolveField('status', () => StatusGraphQLObject)
  protected async getStatusForCycle(@Parent() cycle: CycleGraphQLNode, @Args() request: StatusRequest) {
    this.logger.log({
      cycle,
      request,
      message: 'Fetching current status for this cycle',
    })

    const status = await this.cycleStatusProvider.fromRoot({
      cycleId: cycle.id,
      since: request.date,
      include: ['progress', 'confidence', 'latestCheckIn', 'isActive', 'isOutdated'],
    })

    return {
      progress: status.progress,
      confidence: status.confidence,
      isActive: status.isActive,
      isOutdated: status.isOutdated,
      reportDate: status.latestCheckIn?.createdAt,
      latestCheckIn: status.latestCheckIn ?? undefined,
    }
  }

  @Stopwatch({ omitArgs: true })
  @ResolveField('team', () => TeamGraphQLNode)
  protected async getTeamForCycle(@Parent() cycle: CycleGraphQLNode) {
    this.logger.log({
      cycle,
      message: 'Fetching team for cycle',
    })

    return this.core.team.getOne({ id: cycle.teamId })
  }

  @Cacheable((request, cycle) => [cycle.id, request], 5 * 60)
  @Stopwatch({ omitArgs: true })
  @ResolveField('objectives', () => ObjectivesGraphQLConnection, { nullable: true })
  protected async getObjectivesForCycle(@Args() request: ObjectiveFiltersRequest, @Parent() cycle: CycleGraphQLNode) {
    this.logger.log({
      cycle,
      request,
      message: 'Fetching objectives for cycle',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<ObjectiveFiltersRequest, Objective>(request)

    const queryResult = await this.core.objective.getFromCycle(cycle, filters, queryOptions)

    return this.relay.marshalResponse<ObjectiveInterface>(queryResult, connection, cycle)
  }

  @Stopwatch({ omitArgs: true })
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

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<CycleFiltersRequest, Cycle>(request)

    const childCycles = await this.core.cycle.getChildCycles(cycle, filters, queryOptions)
    const sortedByCadenceChildCycles = this.core.cycle.sortCyclesByCadence(childCycles)

    return this.relay.marshalResponse<CycleInterface>(sortedByCadenceChildCycles, connection, cycle)
  }

  @Cacheable((request, cycle) => [cycle.id, request], 5 * 60)
  @Stopwatch({ omitArgs: true })
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

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<KeyResultFiltersRequest, KeyResult>(request)

    const objectives = await this.core.objective.getFromCycle(cycle)
    const keyResults = await this.core.keyResult.getFromObjectives(objectives, filters, queryOptions)

    return this.relay.marshalResponse<KeyResultInterface>(keyResults, connection, cycle)
  }

  @ResolveField('delta', () => DeltaGraphQLObject)
  protected async getDeltaForObjective(@Parent() cycle: CycleGraphQLNode) {
    this.logger.log({
      cycle,
      message: 'Fetching delta for this cycle',
    })

    const baseDate = new Date()

    const [currentStatus, previousStatus] = await Promise.all([
      this.cycleStatusProvider.fromRoot({
        cycleId: cycle.id,
        since: baseDate,
        include: ['progress', 'confidence', 'latestCheckIn', 'isActive', 'isOutdated'],
      }),
      this.cycleStatusProvider.fromRoot({
        cycleId: cycle.id,
        since: startOfWeek(baseDate),
        include: ['progress', 'confidence', 'latestCheckIn', 'isActive', 'isOutdated'],
      }),
    ])

    this.logger.log('Cycle %s current status is %o', cycle.id, currentStatus)

    return {
      progress: currentStatus.progress - previousStatus.progress,
      confidence: currentStatus.confidence - previousStatus.confidence,
    }
  }

  @GuardedMutation(CycleGraphQLNode, 'cycle:create', { name: 'createCycle' })
  protected async createCycle(
    @Args() request: CycleCreateRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const canCreate = await this.accessControl.canCreate(userWithContext, request.data.teamId)
    if (!canCreate) throw new UnauthorizedException()

    this.logger.log({
      userWithContext,
      request,
      message: 'Received create cycle request',
    })

    const cycle = await this.corePorts.dispatchCommand<Cycle>('create-cycle', {
      ...request.data,
    })
    if (!cycle) throw new UserInputError(`We could not create your cycle`)

    return cycle
  }

  @GuardedMutation(CycleGraphQLNode, 'cycle:update', { name: 'updateCycle' })
  protected async createCycleForRequestAndUserWithContext(
    @Args() request: CycleUpdateRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const canUpdate = await this.accessControl.canUpdate(userWithContext, request.id)
    if (!canUpdate) throw new UnauthorizedException()

    this.logger.log({
      userWithContext,
      request,
      message: 'Received update cycle request',
    })

    const cycle = await this.corePorts.dispatchCommand<Cycle>('update-cycle', request.id, {
      ...request.data,
    })
    if (!cycle) throw new UserInputError(`We could not found an cycle with ID ${request.id}`)

    return cycle
  }

  @GuardedMutation(DeleteResultGraphQLObject, 'cycle:delete', { name: 'deleteCycle' })
  protected async deleteCycleForRequestUsingState(
    @Args() request: NodeDeleteRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const canDelete = await this.accessControl.canDelete(userWithContext, request.id)
    if (!canDelete) throw new UnauthorizedException()

    this.logger.log({
      userWithContext,
      request,
      message: 'Received delete cycle request',
    })

    const deleteResult = await this.corePorts.dispatchCommand('delete-cycle', request.id)
    if (!deleteResult) throw new UserInputError('We could not delete your cycle')

    return deleteResult
  }
}
