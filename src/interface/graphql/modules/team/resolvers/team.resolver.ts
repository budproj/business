import { Logger } from '@nestjs/common'
import { Args, Float, Parent, ResolveField } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { AuthorizedRequestUser } from '@interface/graphql/authorization/decorators/authorized-request-user.decorator'
import { GuardedQuery } from '@interface/graphql/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-node.resolver'
import { CycleGraphQLNode } from '@interface/graphql/objects/cycle/cycle.node'
import { KeyResultCheckInGraphQLNode } from '@interface/graphql/objects/key-result/check-in/key-result-check-in.node'
import { KeyResultGraphQLNode } from '@interface/graphql/objects/key-result/key-result.node'
import { TeamStatusObject } from '@interface/graphql/objects/team/team-status.object'
import { TeamGraphQLNode } from '@interface/graphql/objects/team/team.node'
import { TeamsGraphQLConnection } from '@interface/graphql/objects/team/teams.connection'
import { UserGraphQLNode } from '@interface/graphql/objects/user/user.node'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'

import { TeamLevelGraphQLEnum } from '../enums/team-level.enum'
import { TeamFiltersRequest } from '../requests/team-filters.request'

@GuardedResolver(TeamGraphQLNode)
export class TeamGraphQLResolver extends GuardedNodeGraphQLResolver<Team, TeamInterface> {
  private readonly logger = new Logger(TeamGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.TEAM, core, core.team)
  }

  @GuardedQuery(TeamGraphQLNode, 'team:read', { name: 'team' })
  protected async getTeamForRequestAndAuthorizedRequestUser(
    @Args() request: NodeIndexesRequest,
    @AuthorizedRequestUser() authorizationUser: AuthorizationUser,
  ) {
    this.logger.log({
      request,
      message: 'Fetching team with provided indexes',
    })

    const team = await this.queryGuard.getOneWithActionScopeConstraint(request, authorizationUser)
    if (!team) throw new UserInputError(`We could not found a team with the provided arguments`)

    return team
  }

  @GuardedQuery(TeamsGraphQLConnection, 'team:read', { name: 'teams' })
  protected async getTeamsForRequestAndAuthorizedRequestUser(
    @Args() request: TeamFiltersRequest,
    @AuthorizedRequestUser() authorizationUser: AuthorizationUser,
  ) {
    this.logger.log({
      request,
      authorizationUser,
      message: 'Fetching teams with filters',
    })

    const [{ level, ...filters }, queryOptions, connection] = this.relay.unmarshalRequest<
      TeamFiltersRequest,
      Team
    >(request)

    const queryLeveledHandlers = {
      default: async () =>
        this.queryGuard.getManyWithActionScopeConstraint(filters, authorizationUser, queryOptions),
      [TeamLevelGraphQLEnum.COMPANY]: async () =>
        this.core.team.getUserCompanies(authorizationUser, filters, queryOptions),
      [TeamLevelGraphQLEnum.COMPANY_OR_DEPARTMENT]: async () =>
        this.core.team.getUserCompaniesAndDepartments(authorizationUser, filters, queryOptions),
    }

    const queryHandler = queryLeveledHandlers[level ?? 'default']
    const queryResult = await queryHandler()

    return this.relay.marshalResponse<Team>(queryResult, connection)
  }

  @ResolveField('status', () => TeamStatusObject)
  protected async getStatusForTeam(@Parent() team: TeamGraphQLNode) {
    this.logger.log({
      team,
      message: 'Fetching current status for this team',
    })

    const status = await this.core.team.getCurrentStatus(team)

    return status
  }

  @ResolveField('owner', () => UserGraphQLNode)
  protected async getOwnerForTeam(@Parent() team: TeamGraphQLNode) {
    this.logger.log({
      team,
      message: 'Fetching owner for team',
    })

    return this.core.user.getOne({ id: team.ownerId })
  }

  @ResolveField('teams', () => [TeamGraphQLNode], { nullable: true })
  protected async getChildTeamsForTeam(@Parent() team: TeamGraphQLNode) {
    this.logger.log({
      team,
      message: 'Fetching child teams for team',
    })

    const childTeams = await this.core.team.getTeamChildTeams(team)

    return childTeams
  }

  @ResolveField('rankedTeams', () => [TeamGraphQLNode], { nullable: true })
  protected async getRankedTeamsForTeam(@Parent() team: TeamGraphQLNode) {
    this.logger.log({
      team,
      message: 'Fetching child teams for team ranked by progress',
    })

    const rankedTeams = await this.core.team.getRankedTeamsBelowNode(team)

    return rankedTeams
  }

  @ResolveField('parent', () => TeamGraphQLNode, { nullable: true })
  protected async getParentForTeam(@Parent() team: TeamGraphQLNode) {
    this.logger.log({
      team,
      message: 'Fetching parent team for team',
    })

    const parent = await this.core.team.getOne({ id: team.parentId })

    return parent
  }

  @ResolveField('users', () => [UserGraphQLNode], { nullable: true })
  protected async getUsersForTeam(@Parent() team: TeamGraphQLNode) {
    this.logger.log({
      team,
      message: 'Fetching users for team',
    })

    return this.core.team.getUsersInTeam(team)
  }

  @ResolveField('isCompany', () => Boolean)
  protected async getIsCompanyForTeam(@Parent() team: TeamGraphQLNode) {
    this.logger.log({
      team,
      message: 'Deciding if the team is a company',
    })

    return this.core.team.specification.isACompany.isSatisfiedBy(team)
  }

  @ResolveField('cycles', () => [CycleGraphQLNode], { nullable: true })
  protected async getCyclesForTeam(@Parent() team: TeamGraphQLNode) {
    this.logger.log({
      team,
      message: 'Fetching cycles for team',
    })

    return this.core.cycle.getFromTeam(team)
  }

  @ResolveField('keyResults', () => [KeyResultGraphQLNode], { nullable: true })
  protected async getKeyResultsForTeam(@Parent() team: TeamGraphQLNode) {
    this.logger.log({
      team,
      message: 'Fetching key results for team',
    })

    return this.core.keyResult.getFromTeams(team)
  }

  @ResolveField('progressIncreaseSinceLastWeek', () => Float)
  protected async getProgressIncreaseSinceLastWeekForTeam(@Parent() team: TeamGraphQLNode) {
    this.logger.log({
      team,
      message: 'Fetching the progress increase for team since last week',
    })

    return this.core.team.getTeamProgressIncreaseSinceLastWeek(team)
  }

  @ResolveField('latestKeyResultCheckIn', () => KeyResultCheckInGraphQLNode, { nullable: true })
  protected async getLatestKeyResultCheckInForTeam(@Parent() team: TeamGraphQLNode) {
    this.logger.log({
      team,
      message: 'Fetching latest key result check-in for team',
    })

    return this.core.keyResult.getLatestCheckInForTeam(team)
  }
}
