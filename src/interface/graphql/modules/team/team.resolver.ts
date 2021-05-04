import { Logger } from '@nestjs/common'
import { Args, Float, Parent, ResolveField } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { ObjectiveInterface } from '@core/modules/objective/interfaces/objective.interface'
import { Objective } from '@core/modules/objective/objective.orm-entity'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { UserInterface } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'
import { AuthorizedRequestUser } from '@interface/graphql/adapters/authorization/decorators/authorized-request-user.decorator'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-node.resolver'
import { CycleFiltersRequest } from '@interface/graphql/modules/cycle/requests/cycle-filters.request'
import { KeyResultCheckInGraphQLNode } from '@interface/graphql/modules/key-result/check-in/key-result-check-in.node'
import { KeyResultFiltersRequest } from '@interface/graphql/modules/key-result/requests/key-result-filters.request'
import { ObjectiveFiltersRequest } from '@interface/graphql/modules/objective/requests/objective-filters.request'
import { UserFiltersRequest } from '@interface/graphql/modules/user/requests/user-filters.request'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'

import { TeamCyclesGraphQLConnection } from './connections/team-cycles/team-cycles.connection'
import { TeamKeyResultsGraphQLConnection } from './connections/team-key-results/team-key-results.connection'
import { TeamObjectivesGraphQLConnection } from './connections/team-objectives/team-objectives.connection'
import { TeamTeamsGraphQLConnection } from './connections/team-teams/team-teams.connection'
import { TeamUsersGraphQLConnection } from './connections/team-users/team-users.connection'
import { TeamStatusObject } from './objects/team-status.object'
import { TeamFiltersRequest } from './requests/team-filters.request'
import { TeamGraphQLNode } from './team.node'

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

  @ResolveField('teams', () => TeamTeamsGraphQLConnection, { nullable: true })
  protected async getChildTeamsForTeam(
    @Args() request: TeamFiltersRequest,
    @Parent() team: TeamGraphQLNode,
  ) {
    this.logger.log({
      team,
      request,
      message: 'Fetching child teams for team',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      ObjectiveFiltersRequest,
      Objective
    >(request)

    const queryResult = await this.core.team.getTeamChildTeams(team, filters, queryOptions)

    return this.relay.marshalResponse<TeamInterface>(queryResult, connection)
  }

  @ResolveField('rankedTeams', () => TeamTeamsGraphQLConnection, { nullable: true })
  protected async getRankedTeamsForTeam(
    @Args() request: TeamFiltersRequest,
    @Parent() team: TeamGraphQLNode,
  ) {
    this.logger.log({
      team,
      request,
      message: 'Fetching ranked teams for team',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      ObjectiveFiltersRequest,
      Objective
    >(request)

    const queryResult = await this.core.team.getRankedTeamsBelowNode(team, filters, queryOptions)

    return this.relay.marshalResponse<TeamInterface>(queryResult, connection)
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

  @ResolveField('users', () => TeamUsersGraphQLConnection, { nullable: true })
  protected async getUsersForTeam(
    @Args() request: UserFiltersRequest,
    @Parent() team: TeamGraphQLNode,
  ) {
    this.logger.log({
      team,
      request,
      message: 'Fetching users for team',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      UserFiltersRequest,
      User
    >(request)

    const queryResult = await this.core.team.getUsersInTeam(team, filters, queryOptions)

    return this.relay.marshalResponse<UserInterface>(queryResult, connection)
  }

  @ResolveField('isCompany', () => Boolean)
  protected async getIsCompanyForTeam(@Parent() team: TeamGraphQLNode) {
    this.logger.log({
      team,
      message: 'Deciding if the team is a company',
    })

    return this.core.team.specification.isACompany.isSatisfiedBy(team)
  }

  @ResolveField('cycles', () => TeamCyclesGraphQLConnection, { nullable: true })
  protected async getCyclesForTeam(
    @Args() request: CycleFiltersRequest,
    @Parent() team: TeamGraphQLNode,
  ) {
    this.logger.log({
      team,
      request,
      message: 'Fetching cycles for team',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      CycleFiltersRequest,
      Cycle
    >(request)

    const queryResult = await this.core.cycle.getFromTeamsWithFilters([team], filters, queryOptions)

    return this.relay.marshalResponse<CycleInterface>(queryResult, connection)
  }

  @ResolveField('objectives', () => TeamObjectivesGraphQLConnection, { nullable: true })
  protected async getObjectivesForRequestAndUser(
    @Args() request: ObjectiveFiltersRequest,
    @Parent() team: TeamGraphQLNode,
  ) {
    this.logger.log({
      team,
      request,
      message: 'Fetching objectives for team',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      ObjectiveFiltersRequest,
      Objective
    >(request)

    const queryResult = await this.core.objective.getFromTeams(team, filters, queryOptions)

    return this.relay.marshalResponse<ObjectiveInterface>(queryResult, connection)
  }

  @ResolveField('keyResults', () => TeamKeyResultsGraphQLConnection, { nullable: true })
  protected async getKeyResultsForTeam(
    @Args() request: KeyResultFiltersRequest,
    @Parent() team: TeamGraphQLNode,
  ) {
    this.logger.log({
      team,
      request,
      message: 'Fetching key-results for team',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      KeyResultFiltersRequest,
      KeyResult
    >(request)

    const queryResult = await this.core.keyResult.getFromTeams(team, filters, queryOptions)

    return this.relay.marshalResponse<KeyResultInterface>(queryResult, connection)
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
