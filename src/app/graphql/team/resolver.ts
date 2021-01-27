import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Float, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { isUndefined, omitBy } from 'lodash'

import { PERMISSION, RESOURCE } from 'src/app/authz/constants'
import { Permissions } from 'src/app/authz/decorators'
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

import { TeamObject } from './models'

@UseGuards(GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => TeamObject)
class GraphQLTeamResolver extends GraphQLEntityResolver<Team, TeamDTO> {
  private readonly logger = new Logger(GraphQLTeamResolver.name)

  constructor(protected readonly domain: DomainService) {
    super(RESOURCE.TEAM, domain, domain.team)
  }

  @Permissions(PERMISSION['TEAM:READ'])
  @Query(() => TeamObject, { name: 'team' })
  protected async getTeam(
    @Args('id', { type: () => ID }) id: TeamObject['id'],
    @GraphQLUser() user: AuthzUser,
  ) {
    this.logger.log(`Fetching team with id ${id.toString()}`)

    const team = await this.getOneWithActionScopeConstraint({ id }, user)
    if (!team) throw new NotFoundException(`We could not found a team with id ${id}`)

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

  @ResolveField('teams', () => [TeamObject])
  protected async getTeamChildTeams(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching child teams for team',
    })

    return this.domain.team.getMany({ parentTeamId: team.id })
  }

  @ResolveField('cycles', () => [CycleObject], { nullable: true })
  protected async getTeamCycles(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching cycles for team',
    })

    return this.domain.cycle.getFromTeam(team)
  }

  @ResolveField('users', () => [UserObject])
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

  @ResolveField('latestCheckIn', () => KeyResultCheckInObject, { nullable: true })
  protected async getTeamLatestCheckIn(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching latest key result check-in for team',
    })

    return this.domain.keyResult.getLatestCheckInForTeam(team)
  }

  @ResolveField('currentProgress', () => Float)
  protected async getTeamCurrentProgress(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching current progress for team',
    })

    return this.domain.team.getCurrentProgressForTeam(team)
  }
  //
  // @ResolveField()
  // async currentConfidence(@Parent() team: TeamObject) {
  //   this.logger.log({
  //     team,
  //     message: 'Fetching current confidence for team',
  //   })
  //
  //   return this.teamDomain.getCurrentConfidence(team.id)
  // }
  //
  // @ResolveField()
  // async percentageProgressIncrease(@Parent() team: TeamObject) {
  //   this.logger.log({
  //     team,
  //     message: 'Fetching percentage progress increase for team',
  //   })
  //
  //   return this.teamDomain.getPercentageProgressIncrease(team.id)
  // }
  //
}

export default GraphQLTeamResolver
