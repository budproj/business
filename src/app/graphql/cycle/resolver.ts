import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Context, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { ApolloError, Context as ApolloServerContext } from 'apollo-server-core'
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
import { ObjectiveObject } from 'src/app/graphql/objective/models'
import GraphQLEntityResolver, { GraphQLEntityContext } from 'src/app/graphql/resolver'
import { TeamObject } from 'src/app/graphql/team/models'
import { CycleDTO } from 'src/domain/cycle/dto'
import { Cycle } from 'src/domain/cycle/entities'
import DomainService from 'src/domain/service'
import RailwayProvider from 'src/railway'

import { CycleFiltersArguments, CycleObject } from './models'

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
    @Args() arguments_: CycleFiltersArguments,
  ) {
    this.logger.log({
      arguments_,
      message: 'Fetching cycles',
    })

    const userTeams = await user.teams
    const userTeamsTree = await this.domain.team.getTeamNodesTreeBeforeTeam(userTeams)
    const cyclesPromise = this.domain.cycle.getFromTeamsWithFilters(userTeamsTree, arguments_)

    const [error, cycles] = await this.railway.execute<Cycle[]>(cyclesPromise)
    if (error) throw new ApolloError(error.message)

    if (!cycles || cycles.length === 0)
      throw new UserInputError('We could not find any cycles for your user')

    return cycles
  }

  @ResolveField('team', () => TeamObject)
  protected async getCycleTeam(
    @Parent() cycle: CycleObject,
    @Context() context: ApolloServerContext<GraphQLEntityContext>,
  ) {
    this.logger.log({
      cycle,
      message: 'Fetching team for cycle',
    })

    const team = await this.domain.team.getOne({ id: cycle.teamId })
    context.filters = await this.buildTeamsFilters(team, context.filters)

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
}

export default GraphQLCycleResolver
