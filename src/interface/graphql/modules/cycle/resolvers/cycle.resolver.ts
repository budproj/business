import { Logger } from '@nestjs/common'
import { Args, Parent, ResolveField } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { AuthorizedRequestUser } from '@interface/graphql/authorization/decorators/authorized-request-user.decorator'
import { GuardedQuery } from '@interface/graphql/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-node.resolver'
import { CycleStatusObject } from '@interface/graphql/objects/cycle/cycle-status.object'
import { CycleGraphQLNode } from '@interface/graphql/objects/cycle/cycle.node'
import { CyclesGraphQLConnection } from '@interface/graphql/objects/cycle/cycles.connection'
import { KeyResultGraphQLNode } from '@interface/graphql/objects/key-result/key-result.node'
import { ObjectiveGraphQLNode } from '@interface/graphql/objects/objective/objective.node'
import { TeamGraphQLNode } from '@interface/graphql/objects/team/team.node'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'

import { KeyResultFiltersRequest } from '../../key-result/requests/key-result-filters.request'
import { CycleFiltersRequest } from '../requests/cycle-filters.request'
import { CyclesInSamePeriodRequest } from '../requests/cycles-in-same-period.request'

@GuardedResolver(CycleGraphQLNode)
export class CycleGraphQLResolver extends GuardedNodeGraphQLResolver<Cycle, CycleInterface> {
  private readonly logger = new Logger(CycleGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.CYCLE, core, core.cycle)
  }

  @GuardedQuery(CycleGraphQLNode, 'cycle:read', { name: 'cycle' })
  protected async getCycle(
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

  @GuardedQuery(CyclesGraphQLConnection, 'cycle:read', { name: 'cycles' })
  protected async getCycles(
    @Args() request: CycleFiltersRequest,
    @AuthorizedRequestUser() authorizationUser: AuthorizationUser,
  ) {
    this.logger.log({
      request,
      authorizationUser,
      message: 'Fetching teams with filters',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      CycleFiltersRequest,
      Cycle
    >(request)

    const userTeamsTree = await this.core.team.getTeamNodesTreeBeforeTeam(authorizationUser.teams)
    const queryResult = await this.core.cycle.getFromTeamsWithFilters(
      userTeamsTree,
      filters,
      queryOptions,
    )

    return this.relay.marshalResponse<Cycle>(queryResult, connection)
  }

  @GuardedQuery(CyclesGraphQLConnection, 'cycle:read', { name: 'cyclesInSamePeriod' })
  protected async getCyclesInSamePeriod(
    @AuthorizedRequestUser() authorizationUser: AuthorizationUser,
    @Args() request: CyclesInSamePeriodRequest,
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
  protected async getCycleStatus(@Parent() cycle: CycleGraphQLNode) {
    this.logger.log({
      cycle,
      message: 'Fetching current status for this cycle',
    })

    const status = await this.core.cycle.getCurrentStatus(cycle)

    return status
  }

  @ResolveField('team', () => TeamGraphQLNode)
  protected async getCycleTeam(@Parent() cycle: CycleGraphQLNode) {
    this.logger.log({
      cycle,
      message: 'Fetching team for cycle',
    })

    const team = await this.core.team.getOne({ id: cycle.teamId })

    return team
  }

  @ResolveField('objectives', () => [ObjectiveGraphQLNode], { nullable: true })
  protected async getCycleObjectives(@Parent() cycle: CycleGraphQLNode) {
    this.logger.log({
      cycle,
      message: 'Fetching objectives for cycle',
    })

    return this.core.objective.getFromCycle(cycle)
  }

  @ResolveField('parent', () => CycleGraphQLNode, { nullable: true })
  protected async getParentCycle(@Parent() cycle: CycleGraphQLNode) {
    this.logger.log({
      cycle,
      message: 'Fetching parent cycle for cycle',
    })

    const parentCycle = await this.core.cycle.getOne({ id: cycle.parentId })

    return parentCycle
  }

  @ResolveField('cycles', () => [CycleGraphQLNode], { nullable: true })
  protected async getChildCycles(
    @Parent() cycle: CycleGraphQLNode,
    @Args() filters: CycleFiltersRequest,
  ) {
    this.logger.log({
      cycle,
      filters,
      message: 'Fetching child cycles for cycle',
    })

    const childCycles = await this.core.cycle.getChildCycles(cycle, filters)
    const sortedByCadenceChildCycles = this.core.cycle.sortCyclesByCadence(childCycles)

    return sortedByCadenceChildCycles
  }

  @ResolveField('keyResults', () => [KeyResultGraphQLNode], { nullable: true })
  protected async getCycleKeyResults(
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
