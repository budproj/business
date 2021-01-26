import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Query, Resolver } from '@nestjs/graphql'

import { PERMISSION, RESOURCE } from 'src/app/authz/constants'
import { GraphQLUser, Permissions } from 'src/app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'src/app/authz/guards'
import { EnhanceWithBudUser } from 'src/app/authz/interceptors'
import { AuthzUser } from 'src/app/authz/types'
import GraphQLEntityResolver from 'src/app/graphql/resolver'
import DomainService from 'src/domain/service'
import { TeamDTO } from 'src/domain/team/dto'
import { Team } from 'src/domain/team/entities'

import { TeamObject } from './models'

@UseGuards(GraphQLAuthGuard, GraphQLPermissionsGuard)
@UseInterceptors(EnhanceWithBudUser)
@Resolver(() => TeamObject)
class GraphQLTeamResolver extends GraphQLEntityResolver<Team, TeamDTO> {
  private readonly logger = new Logger(GraphQLTeamResolver.name)

  constructor(protected readonly domain: DomainService) {
    super(RESOURCE.TEAM, domain, domain.team)
  }

  @Permissions(PERMISSION['TEAM:READ'])
  @Query(() => TeamObject)
  async team(@Args('id', { type: () => ID }) id: TeamObject['id'], @GraphQLUser() user: AuthzUser) {
    this.logger.log(`Fetching team with id ${id.toString()}`)

    const team = await this.getOneWithActionScopeConstraint({ id }, user)
    if (!team) throw new NotFoundException(`We could not found a team with id ${id}`)

    return team
  }

  // @Permissions(PERMISSION['TEAM:READ'])
  // @Query(() => [TeamObject], { nullable: true })
  // async teams(
  //   @Args('parentTeamId', { type: () => ID, nullable: true })
  //   parentTeamId: TeamObject['parentTeamId'],
  //   @Args('onlyCompanies', { type: () => Boolean, nullable: true })
  //   onlyCompanies: boolean,
  //   @Args('onlyCompaniesAndDepartments', { type: () => Boolean, nullable: true })
  //   onlyCompaniesAndDepartments: boolean,
  //   @GraphQLUser() user: AuthzUser,
  // ) {
  //   const filters: GraphQLTeamsQueryFilters = {
  //     parentTeamId,
  //     onlyCompanies,
  //     onlyCompaniesAndDepartments,
  //   }
  //   const cleanedFilters = omitBy(filters, isUndefined)
  //
  //   this.logger.log({
  //     cleanedFilters,
  //     onlyCompanies,
  //     message: 'Fetching teams with args',
  //   })
  //
  //   const teams = await this.resolverService.getTeams(cleanedFilters, user)
  //
  //   return teams
  // }
  //
  // @ResolveField()
  // async keyResults(@Parent() team: TeamObject) {
  //   this.logger.log({
  //     team,
  //     message: 'Fetching key results for team',
  //   })
  //
  //   return this.keyResultDomain.getFromTeam(team.id)
  // }
  //
  // @ResolveField()
  // async owner(@Parent() team: TeamObject) {
  //   this.logger.log({
  //     team,
  //     message: 'Fetching owner for team',
  //   })
  //
  //   return this.userDomain.getOne({ id: team.ownerId })
  // }
  //
  // @ResolveField(() => [TeamObject], { name: 'teams' })
  // async getTeams(@Parent() team: TeamObject, @GraphQLUser() user: AuthzUser) {
  //   this.logger.log({
  //     team,
  //     message: 'Fetching child teams for team',
  //   })
  //
  //   return this.resolverService.getManyWithActionScopeConstraint({ parentTeamId: team.id }, user)
  // }
  //
  // @ResolveField()
  // async currentProgress(@Parent() team: TeamObject) {
  //   this.logger.log({
  //     team,
  //     message: 'Fetching current progress for team',
  //   })
  //
  //   return this.teamDomain.getCurrentProgress(team.id)
  // }
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
  // async users(@Parent() team: TeamObject) {
  //   this.logger.log({
  //     team,
  //     message: 'Fetching users for team',
  //   })
  //
  //   return this.teamDomain.getUsersInTeam(team.id)
  // }
  //
  // @ResolveField()
  // async objectives(@Parent() team: TeamObject) {
  //   this.logger.log({
  //     team,
  //     message: 'Fetching objectives for team',
  //   })
  //
  //   return this.objectiveDomain.getFromTeam(team.id)
  // }
  //
  // @ResolveField()
  // async cycles(@Parent() team: TeamObject) {
  //   this.logger.log({
  //     team,
  //     message: 'Fetching cycles for team',
  //   })
  //
  //   return this.cycleDomain.getFromTeam(team.id)
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
  // @ResolveField()
  // async latestReport(@Parent() team: TeamObject) {
  //   this.logger.log({
  //     team,
  //     message: 'Fetching latest report for team',
  //   })
  //
  //   return this.teamDomain.getLatestReport(team.id)
  // }
  //
  // @ResolveField()
  // async isCompany(@Parent() team: TeamObject) {
  //   this.logger.log({
  //     team,
  //     message: 'Deciding if the team is a company',
  //   })
  //
  //   return this.teamDomain.specification.isACompany.isSatisfiedBy(team)
  // }
}

export default GraphQLTeamResolver
