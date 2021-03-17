import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { ApolloError } from 'apollo-server-core'
import { UserInputError } from 'apollo-server-fastify'

import { PERMISSION, RESOURCE } from 'src/app/authz/constants'
import { Permissions } from 'src/app/authz/decorators'
import AuthzService from 'src/app/authz/service'
import { AuthzUser } from 'src/app/authz/types'
import { GraphQLUser } from 'src/app/graphql/authz/decorators'
import { GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard } from 'src/app/graphql/authz/guards'
import {
  EnhanceWithBudUser,
  EnhanceWithUserResourceConstraint,
} from 'src/app/graphql/authz/interceptors'
import { KeyResultFilterArguments, KeyResultObject } from 'src/app/graphql/key-result/models'
import { ObjectiveObject } from 'src/app/graphql/objective/models'
import GraphQLEntityResolver from 'src/app/graphql/resolver'
import { TeamObject } from 'src/app/graphql/team/models'
import { CycleDTO } from 'src/domain/cycle/dto'
import { Cycle } from 'src/domain/cycle/entities'
import DomainService from 'src/domain/service'
import RailwayProvider from 'src/railway'

import { CycleQueryArguments, CycleObject, CycleStatusObject } from './models'

@UseGuards(GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard)
@UseInterceptors(EnhanceWithBudUser, EnhanceWithUserResourceConstraint)
@Resolver(() => CycleObject)
class GraphQLCycleResolver extends GraphQLEntityResolver<Cycle, CycleDTO> {
  private readonly logger = new Logger(GraphQLCycleResolver.name)

  constructor(
    protected readonly domain: DomainService,
    protected readonly authzService: AuthzService,
    private readonly railway: RailwayProvider,
  ) {
    super(RESOURCE.CYCLE, domain, domain.cycle, authzService)
  }

  @Permissions(PERMISSION['CYCLE:READ'])
  @Query(() => CycleObject, { name: 'cycle' })
  protected async getCycle(
    @Args('id', { type: () => ID }) id: CycleObject['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching cycle with id ${id}`)

    const cycle = await this.getOneWithActionScopeConstraint({ id }, user)
    if (!cycle) throw new UserInputError(`We could not found a cycle with id ${id}`)

    return cycle
  }

  @Permissions(PERMISSION['CYCLE:READ'])
  @Query(() => [CycleObject], { name: 'cycles', nullable: true })
  protected async getAllCycles(
    @GraphQLUser() user: AuthzUser,
    @Args() { orderBy, ...filters }: CycleQueryArguments,
  ) {
    this.logger.log({
      orderBy,
      filters,
      message: 'Fetching cycles',
    })

    const userTeams = await user.teams
    const userTeamsTree = await this.domain.team.getTeamNodesTreeBeforeTeam(userTeams)
    const cyclesPromise = this.domain.cycle.getFromTeamsWithFilters(userTeamsTree, filters)

    const [error, cycles] = await this.railway.execute<Cycle[]>(cyclesPromise)
    if (error) throw new ApolloError(error.message)

    if (!cycles || cycles.length === 0)
      throw new UserInputError('We could not find any cycles for your user')

    const sortedByCadenceCycles = this.domain.cycle.sortCyclesByCadence(cycles, orderBy.cadence)

    return sortedByCadenceCycles
  }

  @ResolveField('team', () => TeamObject)
  protected async getCycleTeam(@Parent() cycle: CycleObject) {
    this.logger.log({
      cycle,
      message: 'Fetching team for cycle',
    })

    const team = await this.domain.team.getOne({ id: cycle.teamId })

    return team
  }

  @ResolveField('objectives', () => [ObjectiveObject], { nullable: true })
  protected async getCycleObjectives(@Parent() cycle: CycleObject) {
    this.logger.log({
      cycle,
      message: 'Fetching objectives for cycle',
    })

    return this.domain.objective.getFromCycle(cycle)
  }

  @ResolveField('keyResults', () => [KeyResultObject], { nullable: true })
  protected async getCycleKeyResults(
    @Args() keyResultsFilter: KeyResultFilterArguments,
    @Parent() cycle: CycleObject,
  ) {
    this.logger.log({
      cycle,
      keyResultsFilter,
      message: 'Fetching key results for cycle',
    })

    const objectives = await this.domain.objective.getFromCycle(cycle)
    const keyResults = await this.domain.keyResult.getFromObjectives(objectives, keyResultsFilter)

    return keyResults
  }

  @ResolveField('status', () => CycleStatusObject)
  protected async getCycleStatus(@Parent() cycle: CycleObject) {
    this.logger.log({
      cycle,
      message: 'Fetching current status for this cycle',
    })

    const status = await this.domain.cycle.getCurrentStatus(cycle)

    return status
  }

  @ResolveField('parent', () => CycleObject, { nullable: true })
  protected async getParentCycle(@Parent() cycle: CycleObject) {
    this.logger.log({
      cycle,
      message: 'Fetching parent cycle for cycle',
    })

    const parentCycle = await this.domain.cycle.getOne({ id: cycle.parentId })

    return parentCycle
  }

  @ResolveField('cycles', () => [CycleObject], { nullable: true })
  protected async getChildCycles(@Parent() cycle: CycleObject) {
    this.logger.log({
      cycle,
      message: 'Fetching child cycles for cycle',
    })

    const childCycles = await this.domain.cycle.getChildCycles(cycle)

    return childCycles
  }
}

export default GraphQLCycleResolver
