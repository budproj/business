import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { CoreProvider } from '@core/core.provider'
import { GetOptions } from '@core/interfaces/get-options'
import { TeamInterface } from '@core/modules/team/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { GraphQLRequiredPoliciesGuard } from '@interface/graphql/authorization/guards/required-policies.guard'
import { GraphQLTokenGuard } from '@interface/graphql/authorization/guards/token.guard'
import { CycleGraphQLNode } from '@interface/graphql/nodes/cycle.node'
import { KeyResultGraphQLNode } from '@interface/graphql/nodes/key-result.node'
import { TeamGraphQLNode } from '@interface/graphql/nodes/team.node'
import { UserGraphQLNode } from '@interface/graphql/nodes/user.node'
import { BaseGraphQLResolver } from '@interface/graphql/resolvers/base.resolver'
import { GraphQLUser } from '@interface/graphql/resolvers/decorators/graphql-user'
import { NourishUserDataInterceptor } from '@interface/graphql/resolvers/interceptors/nourish-user-data.interceptor'

import { TeamLevelGraphQLEnum } from '../enums/team-level.enum'
import { TeamListGraphQLObject } from '../objects/team-list.object'
import { TeamFiltersRequest } from '../requests/team-filters.request'
import { TeamRootEdgeGraphQLResponse } from '../responses/team-root-edge.response'

@UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard)
@UseInterceptors(NourishUserDataInterceptor)
@Resolver(() => TeamGraphQLNode)
export class TeamGraphQLResolver extends BaseGraphQLResolver<Team, TeamInterface> {
  private readonly logger = new Logger(TeamGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.TEAM, core, core.team)
  }

  @RequiredActions('team:read')
  @Query(() => TeamListGraphQLObject, { name: 'teams' })
  protected async getTeams(
    @Args() { first, level, ...filters }: TeamFiltersRequest,
    @GraphQLUser() graphqlUser: AuthorizationUser,
  ) {
    this.logger.log({
      first,
      level,
      filters,
      graphqlUser,
      message: 'Fetching teams with filters',
    })

    const queryOptions: GetOptions<Team> = {
      limit: first,
    }
    const queryLeveledHandlers = {
      default: async () =>
        this.queryGuard.getManyWithActionScopeConstraint(filters, graphqlUser, queryOptions),
      [TeamLevelGraphQLEnum.COMPANY]: async () =>
        this.core.team.getUserCompanies(graphqlUser, filters, queryOptions),
      [TeamLevelGraphQLEnum.COMPANY_OR_DEPARTMENT]: async () =>
        this.core.team.getUserCompaniesAndDepartments(graphqlUser, filters, queryOptions),
    }

    const queryHandler = queryLeveledHandlers[level ?? 'default']
    const queryResult = await queryHandler()

    const edges = queryResult?.map((node) => new TeamRootEdgeGraphQLResponse({ node }))
    const response = this.marshalListResponse<TeamRootEdgeGraphQLResponse>(edges)

    return response
  }

  @ResolveField('owner', () => UserGraphQLNode)
  protected async getTeamOwner(@Parent() team: TeamGraphQLNode) {
    this.logger.log({
      team,
      message: 'Fetching owner for team',
    })

    return this.core.user.getOne({ id: team.ownerId })
  }

  @ResolveField('teams', () => [TeamGraphQLNode], { nullable: true })
  protected async getTeamChildTeams(@Parent() team: TeamGraphQLNode) {
    this.logger.log({
      team,
      message: 'Fetching child teams for team',
    })

    const childTeams = await this.core.team.getTeamChildTeams(team)

    return childTeams
  }

  @ResolveField('rankedTeams', () => [TeamGraphQLNode], { nullable: true })
  protected async getTeamRankedChildTeams(@Parent() team: TeamGraphQLNode) {
    this.logger.log({
      team,
      message: 'Fetching child teams for team ranked by progress',
    })

    const rankedTeams = await this.core.team.getRankedTeamsBelowNode(team)

    return rankedTeams
  }

  @ResolveField('parent', () => TeamGraphQLNode, { nullable: true })
  protected async getTeamParentTeam(@Parent() team: TeamGraphQLNode) {
    this.logger.log({
      team,
      message: 'Fetching parent team for team',
    })

    const parent = await this.core.team.getOne({ id: team.parentId })

    return parent
  }

  @ResolveField('users', () => [UserGraphQLNode], { nullable: true })
  protected async getTeamUsers(@Parent() team: TeamGraphQLNode) {
    this.logger.log({
      team,
      message: 'Fetching users for team',
    })

    return this.core.team.getUsersInTeam(team)
  }

  @ResolveField('isCompany', () => Boolean)
  protected async getTeamIsCompanySpecification(@Parent() team: TeamGraphQLNode) {
    this.logger.log({
      team,
      message: 'Deciding if the team is a company',
    })

    return this.core.team.specification.isACompany.isSatisfiedBy(team)
  }

  @ResolveField('cycles', () => [CycleGraphQLNode], { nullable: true })
  protected async getTeamCycles(@Parent() team: TeamGraphQLNode) {
    this.logger.log({
      team,
      message: 'Fetching cycles for team',
    })

    return this.core.cycle.getFromTeam(team)
  }

  @ResolveField('keyResults', () => [KeyResultGraphQLNode], { nullable: true })
  protected async getTeamKeyResults(@Parent() team: TeamGraphQLNode) {
    this.logger.log({
      team,
      message: 'Fetching key results for team',
    })

    return this.core.keyResult.getFromTeams(team)
  }
}
