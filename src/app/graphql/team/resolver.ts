import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import {
  Args,
  Context,
  Float,
  GqlExecutionContext,
  ID,
  Int,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'
import { isUndefined, omitBy } from 'lodash'

import { PERMISSION, RESOURCE } from 'src/app/authz/constants'
import { Permissions } from 'src/app/authz/decorators'
import AuthzService from 'src/app/authz/service'
import { AuthzUser } from 'src/app/authz/types'
import { GraphQLUser } from 'src/app/graphql/authz/decorators'
import { GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard } from 'src/app/graphql/authz/guards'
import { EnhanceWithBudUser } from 'src/app/graphql/authz/interceptors'
import { CycleObject } from 'src/app/graphql/cycle/models'
import { KeyResultCheckInObject } from 'src/app/graphql/key-result/check-in/models'
import { KeyResultObject } from 'src/app/graphql/key-result/models'
import { ObjectiveObject } from 'src/app/graphql/objective/models'
import GraphQLEntityResolver from 'src/app/graphql/resolver'
import { UserObject } from 'src/app/graphql/user'
import DomainService from 'src/domain/service'
import { TeamDTO } from 'src/domain/team/dto'
import { Team } from 'src/domain/team/entities'

import { TeamFiltersInput, TeamObject } from './models'

export interface GraphQLTeamContextType extends GqlExecutionContext {
  filters?: TeamFiltersInput
}

@UseGuards(GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => TeamObject)
class GraphQLTeamResolver extends GraphQLEntityResolver<Team, TeamDTO> {
  private readonly logger = new Logger(GraphQLTeamResolver.name)

  constructor(
    protected readonly domain: DomainService,
    protected readonly authzService: AuthzService,
  ) {
    super(RESOURCE.TEAM, domain, domain.team, authzService)
  }

  @Permissions(PERMISSION['TEAM:READ'])
  @Query(() => TeamObject, { name: 'team' })
  protected async getTeam(
    @Args('id', { type: () => ID }) id: TeamObject['id'],
    @Args('filters', { nullable: true }) filters: TeamFiltersInput,
    @Context() context: GraphQLTeamContextType,
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching team with id ${id}`)

    context.filters = filters

    const team = await this.getOneWithActionScopeConstraint({ id }, user)
    if (!team) throw new UserInputError(`We could not found a team with id ${id}`)

    return team
  }

  @Permissions(PERMISSION['TEAM:READ'])
  @Query(() => [TeamObject], { name: 'teams', nullable: true })
  protected async getAllTeams(
    @Args('parentTeamId', { type: () => ID, nullable: true })
    parentTeamId: TeamObject['parentTeamId'],
    @Args('onlyCompanies', { type: () => Boolean, nullable: true })
    onlyCompanies: boolean,
    @Args('onlyCompaniesAndDepartments', { type: () => Boolean, nullable: true })
    onlyCompaniesAndDepartments: boolean,
    @GraphQLUser() user: AuthzUser,
  ) {
    const filters = {
      parentTeamId,
      onlyCompanies,
      onlyCompaniesAndDepartments,
    }
    const cleanedFilters = omitBy(filters, isUndefined)

    this.logger.log({
      cleanedFilters,
      onlyCompanies,
      message: 'Fetching teams with args',
    })

    const railways = {
      default: async () => this.getManyWithActionScopeConstraint(cleanedFilters, user),
      onlyCompanies: async () => this.domain.team.getUserCompanies(user),
      onlyCompaniesAndDepartments: async () =>
        this.domain.team.getUserCompaniesAndDepartments(user),
    }

    const getOnlyCompaniesAndDepartmentsRailway = onlyCompaniesAndDepartments
      ? railways.onlyCompaniesAndDepartments
      : railways.default
    const getAllTeamsRailway = onlyCompanies
      ? railways.onlyCompanies
      : getOnlyCompaniesAndDepartmentsRailway

    const teams = await getAllTeamsRailway()

    return teams
  }

  @ResolveField('owner', () => UserObject)
  protected async getTeamOwner(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching owner for team',
    })

    return this.domain.user.getOne({ id: team.ownerId })
  }

  @ResolveField('teams', () => [TeamObject], { nullable: true })
  protected async getTeamChildTeams(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching child teams for team',
    })

    return this.domain.team.getTeamChildTeams(team)
  }

  @ResolveField('teamsRanking', () => [TeamObject], { nullable: true })
  protected async getTeamRankedChildTeams(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching child teams for team ranked by progress',
    })

    return this.domain.team.getRankedTeamsBelowNode(team)
  }

  @ResolveField('parentTeam', () => TeamObject, { nullable: true })
  protected async getTeamParentTeam(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching parent team for team',
    })

    return this.domain.team.getOne({ id: team.parentTeamId })
  }

  @ResolveField('cycles', () => [CycleObject], { nullable: true })
  protected async getTeamCycles(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching cycles for team',
    })

    return this.domain.cycle.getFromTeam(team)
  }

  @ResolveField('users', () => [UserObject], { nullable: true })
  protected async getTeamUsers(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching users for team',
    })

    return this.domain.team.getUsersInTeam(team)
  }

  @ResolveField('isCompany', () => Boolean)
  protected async getTeamIsCompanySpecification(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Deciding if the team is a company',
    })

    return this.domain.team.specification.isACompany.isSatisfiedBy(team)
  }

  @ResolveField('keyResults', () => [KeyResultObject], { nullable: true })
  protected async getTeamKeyResults(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching key results for team',
    })

    return this.domain.keyResult.getFromTeams(team)
  }

  @ResolveField('objectives', () => [ObjectiveObject], { nullable: true })
  protected async getTeamObjectives(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching objectives for team',
    })

    return this.domain.objective.getFromTeam(team)
  }

  @ResolveField('latestKeyResultCheckIn', () => KeyResultCheckInObject, { nullable: true })
  protected async getTeamLatestKeyResultCheckIn(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching latest key result check-in for team',
    })

    return this.domain.keyResult.getLatestCheckInForTeam(team)
  }

  @ResolveField('progress', () => Float)
  protected async getTeamProgress(
    @Parent() team: TeamObject,
    @Context('filters') filters: TeamFiltersInput,
  ) {
    this.logger.log({
      team,
      filters,
      message: 'Fetching progress for team',
    })

    return this.domain.team.getCurrentProgressForTeam(team, filters)
  }

  @ResolveField('confidence', () => Int)
  protected async getTeamCurrentConfidence(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching current confidence for team',
    })

    return this.domain.team.getCurrentConfidenceForTeam(team)
  }

  @ResolveField('progressIncreaseSinceLastWeek', () => Float)
  protected async getTeamProgressIncreaseSinceLastWeek(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching the progress increase for team since last week',
    })

    return this.domain.team.getTeamProgressIncreaseSinceLastWeek(team)
  }
}

export default GraphQLTeamResolver
