import { Logger, NotFoundException, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, ID, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'
import { omitBy, isUndefined } from 'lodash'

import { PERMISSION } from 'app/authz/constants'
import { GraphQLUser, Permissions } from 'app/authz/decorators'
import { GraphQLAuthGuard, GraphQLPermissionsGuard } from 'app/authz/guards'
import { EnhanceWithBudUser } from 'app/authz/interceptors'
import { AuthzUser } from 'app/authz/types'
import DomainKeyResultService from 'domain/key-result/service'
import DomainObjectiveService from 'domain/objective/service'
import DomainTeamService from 'domain/team/service'
import DomainUserService from 'domain/user/service'

import { TeamObject } from './models'
import GraphQLTeamService from './service'

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
    @GraphQLUser() user: AuthzUser,
  ) {
    const filters = {
      parentTeamId,
    }
    const cleanedFilters = omitBy(filters, isUndefined)

    this.logger.log({
      cleanedFilters,
      message: 'Fetching teams with args',
    })

    const teams = await this.resolverService.getManyWithActionScopeConstraint(cleanedFilters, user)

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
}

export default GraphQLTeamResolver
