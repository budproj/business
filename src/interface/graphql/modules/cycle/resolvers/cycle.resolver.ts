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
import { GraphQLRequiredPoliciesGuard } from '@interface/graphql/authorization/guards/required-policies.guard'
import { GraphQLTokenGuard } from '@interface/graphql/authorization/guards/token.guard'
import { KeyResultFiltersRequest } from '@interface/graphql/modules/key-result/requests/key-result.request'
import { CycleGraphQLNode } from '@interface/graphql/nodes/cycle.node'
import { KeyResultGraphQLNode } from '@interface/graphql/nodes/key-result.node'
import { ObjectiveGraphQLNode } from '@interface/graphql/nodes/objective.node'
import { TeamGraphQLNode } from '@interface/graphql/nodes/team.node'
import { BaseGraphQLResolver } from '@interface/graphql/resolvers/base.resolver'
import { GraphQLUser } from '@interface/graphql/resolvers/decorators/graphql-user'
import { NourishUserDataInterceptor } from '@interface/graphql/resolvers/interceptors/nourish-user-data.interceptor'

import { CycleListGraphQLObject } from '../objects/cycle-list.object'
import { CycleFiltersRequest } from '../requests/cycle-filters.request'
import { CyclesInSamePeriodRequest } from '../requests/cycles-in-same-period.request'
import { CycleRootEdgeGraphQLResponse } from '../responses/cycle-root-edge.response'

@UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard)
@UseInterceptors(NourishUserDataInterceptor)
@Resolver(() => CycleGraphQLNode)
export class CycleGraphQLResolver extends BaseGraphQLResolver<Cycle, CycleInterface> {
  private readonly logger = new Logger(CycleGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.CYCLE, core, core.cycle)
  }

  @RequiredActions('cycle:read')
  @Query(() => CycleListGraphQLObject, { name: 'cycles' })
  protected async getCycles(
    @Args() { first, ...filters }: CycleFiltersRequest,
    @GraphQLUser() graphqlUser: AuthorizationUser,
  ) {
    this.logger.log({
      first,
      filters,
      graphqlUser,
      message: 'Fetching teams with filters',
    })

    const userTeams = await graphqlUser.teams
    const queryOptions: GetOptions<Cycle> = {
      limit: first,
    }

    const userTeamsTree = await this.core.team.getTeamNodesTreeBeforeTeam(userTeams)
    const queryResult = await this.core.cycle.getFromTeamsWithFilters(
      userTeamsTree,
      filters,
      queryOptions,
    )

    const edges = queryResult?.map((node) => new CycleRootEdgeGraphQLResponse({ node }))
    const response = this.marshalListResponse<CycleRootEdgeGraphQLResponse>(edges)

    return response
  }

  @RequiredActions('cycle:read')
  @Query(() => CycleListGraphQLObject, { name: 'cyclesInSamePeriod', nullable: true })
  protected async getCyclesInSamePeriod(
    @GraphQLUser() graphqlUser: AuthorizationUser,
    @Args() { first, fromCycles, ...filters }: CyclesInSamePeriodRequest,
  ) {
    this.logger.log({
      fromCycles,
      first,
      filters,
      message: 'Fetching cycles in same period',
    })

    const userTeams = await graphqlUser.teams
    const queryOptions: GetOptions<Cycle> = {
      limit: first,
    }

    const userTeamsTree = await this.core.team.getTeamNodesTreeBeforeTeam(userTeams)
    const queryResult = await this.core.cycle.getCyclesInSamePeriodFromTeamsAndParentIDsWithFilters(
      userTeamsTree,
      fromCycles,
      filters,
      queryOptions,
    )

    const edges = queryResult?.map((node) => new CycleRootEdgeGraphQLResponse({ node }))
    const response = this.marshalListResponse<CycleRootEdgeGraphQLResponse>(edges)

    return response
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
    @Args() { first, ...filters }: KeyResultFiltersRequest,
    @Parent() cycle: CycleGraphQLNode,
  ) {
    this.logger.log({
      cycle,
      first,
      filters,
      message: 'Fetching key results for cycle',
    })

    const queryOptions: GetOptions<KeyResult> = {
      limit: first,
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
