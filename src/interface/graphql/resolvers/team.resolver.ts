import { Logger, UseGuards, UseInterceptors } from '@nestjs/common'
import { Args, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { RequiredActions } from '@adapters/authorization/required-actions.decorator'
import { CoreProvider } from '@core/core.provider'
import { GetOptions } from '@core/interfaces/get-options'
import { TeamInterface } from '@core/modules/team/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { TeamNodeGraphQLObject } from '@interface/graphql/objects/team/team-nodes.object'
import { TeamQueryResultGraphQLObject } from '@interface/graphql/objects/team/team-query.object'
import { TeamFiltersRequest } from '@interface/graphql/requests/team/team-filters.request'

import { TeamLevelGraphQLEnum } from '../enums/team-level.enum'
import { UserNodeGraphQLObject } from '../objects/user/user-node.object'

import { BaseGraphQLResolver } from './base.resolver'
import { GraphQLUser } from './decorators/graphql-user'
import { GraphQLRequiredPoliciesGuard } from './guards/required-policies.guard'
import { GraphQLTokenGuard } from './guards/token.guard'
import { NourishUserDataInterceptor } from './interceptors/nourish-user-data.interceptor'

@UseGuards(GraphQLTokenGuard, GraphQLRequiredPoliciesGuard)
@UseInterceptors(NourishUserDataInterceptor)
@Resolver(() => TeamNodeGraphQLObject)
export class TeamGraphQLResolver extends BaseGraphQLResolver<Team, TeamInterface> {
  private readonly logger = new Logger(TeamGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.TEAM, core, core.team)
  }

  @RequiredActions('team:read')
  @Query(() => TeamQueryResultGraphQLObject, { name: 'teams' })
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
    const response = this.marshalQueryResponse(queryResult)

    return response
  }

  @ResolveField('owner', () => UserNodeGraphQLObject)
  protected async getTeamOwner(@Parent() team: TeamNodeGraphQLObject) {
    this.logger.log({
      team,
      message: 'Fetching owner for team',
    })

    return this.core.user.getOne({ id: team.ownerId })
  }

  @ResolveField('teams', () => [TeamNodeGraphQLObject], { nullable: true })
  protected async getTeamChildTeams(@Parent() team: TeamNodeGraphQLObject) {
    this.logger.log({
      team,
      message: 'Fetching child teams for team',
    })

    const childTeams = await this.core.team.getTeamChildTeams(team)

    return childTeams
  }

  @ResolveField('rankedTeams', () => [TeamNodeGraphQLObject], { nullable: true })
  protected async getTeamRankedChildTeams(@Parent() team: TeamNodeGraphQLObject) {
    this.logger.log({
      team,
      message: 'Fetching child teams for team ranked by progress',
    })

    const rankedTeams = await this.core.team.getRankedTeamsBelowNode(team)

    return rankedTeams
  }

  @ResolveField('parent', () => TeamNodeGraphQLObject, { nullable: true })
  protected async getTeamParentTeam(@Parent() team: TeamNodeGraphQLObject) {
    this.logger.log({
      team,
      message: 'Fetching parent team for team',
    })

    const parent = await this.core.team.getOne({ id: team.parentId })

    return parent
  }

  @ResolveField('users', () => [UserNodeGraphQLObject], { nullable: true })
  protected async getTeamUsers(@Parent() team: TeamNodeGraphQLObject) {
    this.logger.log({
      team,
      message: 'Fetching users for team',
    })

    return this.core.team.getUsersInTeam(team)
  }

  @ResolveField('isCompany', () => Boolean)
  protected async getTeamIsCompanySpecification(@Parent() team: TeamNodeGraphQLObject) {
    this.logger.log({
      team,
      message: 'Deciding if the team is a company',
    })

    return this.core.team.specification.isACompany.isSatisfiedBy(team)
  }
}
