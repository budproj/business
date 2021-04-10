import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { CoreProvider } from '@core/core.provider'
import { GetOptions } from '@core/interfaces/get-options'
import { CycleInterface } from '@core/modules/cycle/cycle.interface'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { AuthorizedRequestUser } from '@interface/graphql/authorization/decorators/authorized-request-user.decorator'
import { GraphQLRequiredPoliciesGuard } from '@interface/graphql/authorization/guards/required-policies.guard'
import { GraphQLTokenGuard } from '@interface/graphql/authorization/guards/token.guard'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-node.resolver'
import { CycleGraphQLNode } from '@interface/graphql/objects/cycle/cycle.node'
import { CyclesGraphQLConnection } from '@interface/graphql/objects/cycle/cycles.connection'
import { KeyResultGraphQLNode } from '@interface/graphql/objects/key-result/key-result.node'
import { ObjectiveGraphQLNode } from '@interface/graphql/objects/objective/objective.node'
import { TeamGraphQLNode } from '@interface/graphql/objects/team/team.node'
import { NourishUserDataInterceptor } from '@interface/graphql/resolvers/interceptors/nourish-user-data.interceptor'

import { KeyResultFiltersRequest } from '../../key-result/requests/key-result-filters.request'
import { CycleFiltersRequest } from '../requests/cycle-filters.request'
import { CyclesInSamePeriodRequest } from '../requests/cycles-in-same-period.request'

@UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard)
@UseInterceptors(NourishUserDataInterceptor)
@Resolver(() => CycleGraphQLNode)
export class CycleGraphQLResolver extends GuardedNodeGraphQLResolver<Cycle, CycleInterface> {
  private readonly logger = new Logger(CycleGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.CYCLE, core, core.cycle)
  }

  @RequiredActions('cycle:read')
  @Query(() => CyclesGraphQLConnection, { name: 'cycles' })
  protected async getCycles(
    @Args() request: CycleFiltersRequest,
    @AuthorizedRequestUser() authorizedRequestUser: AuthorizationUser,
  ) {
    this.logger.log({
      request,
      authorizedRequestUser,
      message: 'Fetching teams with filters',
    })

    const [connection, filters] = this.relay.unmarshalRequest(request)

    const queryOptions: GetOptions<Cycle> = {
      limit: connection.first,
    }

    const userTeamsTree = await this.core.team.getTeamNodesTreeBeforeTeam(
      authorizedRequestUser.teams,
    )
    const queryResult = await this.core.cycle.getFromTeamsWithFilters(
      userTeamsTree,
      filters,
      queryOptions,
    )

    return this.relay.marshalResponse<Cycle>(queryResult, connection)
  }

  @RequiredActions('cycle:read')
  @Query(() => CyclesGraphQLConnection, { name: 'cyclesInSamePeriod', nullable: true })
  protected async getCyclesInSamePeriod(
    @AuthorizedRequestUser() authorizedRequestUser: AuthorizationUser,
    @Args() request: CyclesInSamePeriodRequest,
  ) {
    this.logger.log({
      request,
      message: 'Fetching cycles in same period',
    })

    const [connection, { fromCycles, ...filters }] = this.relay.unmarshalRequest(request)

    const queryOptions: GetOptions<Cycle> = {
      limit: connection.first,
    }

    const userTeamsTree = await this.core.team.getTeamNodesTreeBeforeTeam(
      authorizedRequestUser.teams,
    )
    const queryResult = await this.core.cycle.getCyclesInSamePeriodFromTeamsAndParentIDsWithFilters(
      userTeamsTree,
      fromCycles,
      filters,
      queryOptions,
    )

    return this.relay.marshalResponse<Cycle>(queryResult, connection)
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

    const [connection, filters] = this.relay.unmarshalRequest(request)

    const queryOptions: GetOptions<KeyResult> = {
      limit: connection.first,
    }

    const objectives = await this.core.objective.getFromCycle(cycle)
    const keyResults = await this.core.keyResult.getFromObjectives(
      objectives,
      filters,
      queryOptions,
    )

    return keyResults
  }
}
