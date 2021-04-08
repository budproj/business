import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { CoreProvider } from '@core/core.provider'
import { GetOptions } from '@core/interfaces/get-options'
import { CycleInterface } from '@core/modules/cycle/cycle.interface'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { KeyResultInterface } from '@core/modules/key-result/key-result.interface'
import { CycleNodeGraphQLObject } from '@interface/graphql/objects/cycle/cycle-node.object'
import { CycleQueryResultGraphQLObject } from '@interface/graphql/objects/cycle/cycle-query.object'
import { KeyResultNodeGraphQLObject } from '@interface/graphql/objects/key-result/key-result-node.object'
import { ObjectiveNodeGraphQLObject } from '@interface/graphql/objects/objetive/objective-node.object'
import { TeamNodeGraphQLObject } from '@interface/graphql/objects/team/team-node.object'
import { CycleFiltersRequest } from '@interface/graphql/requests/cycle/cycle-filters.request'
import { CyclesInSamePeriodRequest } from '@interface/graphql/requests/cycle/cycles-in-same-period.request'
import { KeyResultFiltersRequest } from '@interface/graphql/requests/key-result/key-result.request'

import { BaseGraphQLResolver } from './base.resolver'
import { GraphQLUser } from './decorators/graphql-user'
import { GraphQLRequiredPoliciesGuard } from './guards/required-policies.guard'
import { GraphQLTokenGuard } from './guards/token.guard'
import { NourishUserDataInterceptor } from './interceptors/nourish-user-data.interceptor'

@UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard)
@UseInterceptors(NourishUserDataInterceptor)
@Resolver(() => CycleNodeGraphQLObject)
export class CycleGraphQLResolver extends BaseGraphQLResolver<Cycle, CycleInterface> {
  private readonly logger = new Logger(CycleGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.CYCLE, core, core.cycle)
  }

  @RequiredActions('cycle:read')
  @Query(() => CycleQueryResultGraphQLObject, { name: 'cycles' })
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

    const response = this.marshalQueryResponse<CycleNodeGraphQLObject>(queryResult)

    return response
  }

  @RequiredActions('cycle:read')
  @Query(() => CycleQueryResultGraphQLObject, { name: 'cyclesInSamePeriod', nullable: true })
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

    const response = this.marshalQueryResponse<CycleNodeGraphQLObject>(queryResult)

    return response
  }

  @ResolveField('team', () => TeamNodeGraphQLObject)
  protected async getCycleTeam(@Parent() cycle: CycleNodeGraphQLObject) {
    this.logger.log({
      cycle,
      message: 'Fetching team for cycle',
    })

    const team = await this.core.team.getOne({ id: cycle.teamId })

    return team
  }

  @ResolveField('objectives', () => [ObjectiveNodeGraphQLObject], { nullable: true })
  protected async getCycleObjectives(@Parent() cycle: CycleNodeGraphQLObject) {
    this.logger.log({
      cycle,
      message: 'Fetching objectives for cycle',
    })

    return this.core.objective.getFromCycle(cycle)
  }

  @ResolveField('parent', () => CycleNodeGraphQLObject, { nullable: true })
  protected async getParentCycle(@Parent() cycle: CycleNodeGraphQLObject) {
    this.logger.log({
      cycle,
      message: 'Fetching parent cycle for cycle',
    })

    const parentCycle = await this.core.cycle.getOne({ id: cycle.parentId })

    return parentCycle
  }

  @ResolveField('cycles', () => [CycleNodeGraphQLObject], { nullable: true })
  protected async getChildCycles(
    @Parent() cycle: CycleNodeGraphQLObject,
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

  @ResolveField('keyResults', () => [KeyResultNodeGraphQLObject], { nullable: true })
  protected async getCycleKeyResults(
    @Args() { first, ...filters }: KeyResultFiltersRequest,
    @Parent() cycle: CycleNodeGraphQLObject,
  ) {
    this.logger.log({
      cycle,
      first,
      filters,
      message: 'Fetching key results for cycle',
    })

    const queryOptions: GetOptions<KeyResultInterface> = {
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
