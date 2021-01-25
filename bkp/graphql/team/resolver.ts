import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { omitBy, isUndefined } from 'lodash'

import { PERMISSION } from 'src/app/authz/constants'
import { GraphQLUser, Permissions } from 'src/app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'src/app/authz/guards'
import { EnhanceWithBudUser } from 'src/app/authz/interceptors'
import { AuthzUser } from 'src/app/authz/types'
import DomainCycleService from 'src/domain/cycle/service'
import DomainKeyResultService from 'src/domain/key-result/service'
import DomainObjectiveService from 'src/domain/objective/service'
import DomainTeamService from 'src/domain/team/service'
import DomainUserService from 'src/domain/user/service'

import { TeamObject } from './models'
import GraphQLTeamService from './service'
import { GraphQLTeamsQueryFilters } from './types'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => TeamObject)
class GraphQLTeamResolver {
  private readonly logger = new Logger(GraphQLTeamResolver.name)

  constructor(
    private readonly resolverService: GraphQLTeamService,
    private readonly keyResultDomain: DomainKeyResultService,
    private readonly userDomain: DomainUserService,
    private readonly teamDomain: DomainTeamService,
    private readonly objectiveDomain: DomainObjectiveService,
    private readonly cycleDomain: DomainCycleService,
  ) {}

  @Permissions(PERMISSION['TEAM:READ'])
  @Query(() => TeamObject)
  async team(@Args('id', { type: () => ID }) id: TeamObject['id'], @GraphQLUser() user: AuthzUser) {
    this.logger.log(`Fetching team with id ${id.toString()}`)

    const team = await this.resolverService.getOneWithActionScopeConstraint({ id }, user)
    if (!team) throw new NotFoundException(`We could not found a team with id ${id}`)

    return team
  }

  @Permissions(PERMISSION['TEAM:READ'])
  @Query(() => [TeamObject], { nullable: true })
  async teams(
    @Args('parentTeamId', { type: () => ID, nullable: true })
    parentTeamId: TeamObject['parentTeamId'],
    @Args('onlyCompanies', { type: () => Boolean, nullable: true })
    onlyCompanies: boolean,
    @Args('onlyCompaniesAndDepartments', { type: () => Boolean, nullable: true })
    onlyCompaniesAndDepartments: boolean,
    @GraphQLUser() user: AuthzUser,
  ) {
    const filters: GraphQLTeamsQueryFilters = {
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

    const teams = await this.resolverService.getTeams(cleanedFilters, user)

    return teams
  }

  @ResolveField()
  async keyResults(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching key results for team',
    })

    return this.keyResultDomain.getFromTeam(team.id)
  }

  @ResolveField()
  async owner(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching owner for team',
    })

    return this.userDomain.getOne({ id: team.ownerId })
  }

  @ResolveField(() => [TeamObject], { name: 'teams' })
  async getTeams(@Parent() team: TeamObject, @GraphQLUser() user: AuthzUser) {
    this.logger.log({
      team,
      message: 'Fetching child teams for team',
    })

    return this.resolverService.getManyWithActionScopeConstraint({ parentTeamId: team.id }, user)
  }

  @ResolveField()
  async currentProgress(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching current progress for team',
    })

    return this.teamDomain.getCurrentProgress(team.id)
  }

  @ResolveField()
  async currentConfidence(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching current confidence for team',
    })

    return this.teamDomain.getCurrentConfidence(team.id)
  }

  @ResolveField()
  async users(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching users for team',
    })

    return this.teamDomain.getUsersInTeam(team.id)
  }

  @ResolveField()
  async objectives(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching objectives for team',
    })

    return this.objectiveDomain.getFromTeam(team.id)
  }

  @ResolveField()
  async cycles(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching cycles for team',
    })

    return this.cycleDomain.getFromTeam(team.id)
  }

  @ResolveField()
  async percentageProgressIncrease(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching percentage progress increase for team',
    })

    return this.teamDomain.getPercentageProgressIncrease(team.id)
  }

  @ResolveField()
  async latestReport(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Fetching latest report for team',
    })

    return this.teamDomain.getLatestReport(team.id)
  }

  @ResolveField()
  async isCompany(@Parent() team: TeamObject) {
    this.logger.log({
      team,
      message: 'Deciding if the team is a company',
    })

    return this.teamDomain.specification.isACompany.isSatisfiedBy(team)
  }
}

export default GraphQLTeamResolver