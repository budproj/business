import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { CoreProvider } from '@core/core.provider'
import { TeamInterface } from '@core/modules/team/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { AuthorizedRequestUser } from '@interface/graphql/authorization/decorators/authorized-request-user.decorator'
import { GraphQLRequiredPoliciesGuard } from '@interface/graphql/authorization/guards/required-policies.guard'
import { GraphQLTokenGuard } from '@interface/graphql/authorization/guards/token.guard'
import { NourishUserDataInterceptor } from '@interface/graphql/authorization/interceptors/nourish-user-data.interceptor'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-node.resolver'
import { CycleGraphQLNode } from '@interface/graphql/objects/cycle/cycle.node'
import { KeyResultGraphQLNode } from '@interface/graphql/objects/key-result/key-result.node'
import { TeamGraphQLNode } from '@interface/graphql/objects/team/team.node'
import { TeamsGraphQLConnection } from '@interface/graphql/objects/team/teams.connection'
import { UserGraphQLNode } from '@interface/graphql/objects/user/user.node'

import { TeamLevelGraphQLEnum } from '../enums/team-level.enum'
import { TeamFiltersRequest } from '../requests/team-filters.request'

@UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard)
@UseInterceptors(NourishUserDataInterceptor)
@Resolver(() => TeamGraphQLNode)
export class TeamGraphQLResolver extends GuardedNodeGraphQLResolver<Team, TeamInterface> {
  private readonly logger = new Logger(TeamGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.TEAM, core, core.team)
  }

  @RequiredActions('team:read')
  @Query(() => TeamsGraphQLConnection, { name: 'teams' })
  protected async getTeams(
    @Args() request: TeamFiltersRequest,
    @AuthorizedRequestUser() authorizedRequestUser: AuthorizationUser,
  ) {
    this.logger.log({
      request,
      authorizedRequestUser,
      message: 'Fetching teams with filters',
    })

    const [{ level, ...filters }, queryOptions, connection] = this.relay.unmarshalRequest<
      TeamFiltersRequest,
      Team
    >(request)

    const queryLeveledHandlers = {
      default: async () =>
        this.queryGuard.getManyWithActionScopeConstraint(
          filters,
          authorizedRequestUser,
          queryOptions,
        ),
      [TeamLevelGraphQLEnum.COMPANY]: async () =>
        this.core.team.getUserCompanies(authorizedRequestUser, filters, queryOptions),
      [TeamLevelGraphQLEnum.COMPANY_OR_DEPARTMENT]: async () =>
        this.core.team.getUserCompaniesAndDepartments(authorizedRequestUser, filters, queryOptions),
    }

    const queryHandler = queryLeveledHandlers[level ?? 'default']
    const queryResult = await queryHandler()

    return this.relay.marshalResponse<Team>(queryResult, connection)
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
