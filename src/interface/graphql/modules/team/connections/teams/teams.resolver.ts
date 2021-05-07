import { Logger } from '@nestjs/common'
import { Args } from '@nestjs/graphql'

import { UserWithContext } from '@adapters/context/interfaces/user.interface'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'

import { TeamLevelGraphQLEnum } from '../../enums/team-level.enum'
import { TeamFiltersRequest } from '../../requests/team-filters.request'
import { TeamGraphQLNode } from '../../team.node'

import { TeamsGraphQLConnection } from './teams.connection'

@GuardedResolver(TeamsGraphQLConnection)
export class TeamsConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  Team,
  TeamInterface,
  TeamGraphQLNode
> {
  private readonly logger = new Logger(TeamsConnectionGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.TEAM, core, core.team)
  }

  @GuardedQuery(TeamsGraphQLConnection, 'team:read', { name: 'teams' })
  protected async getTeamsForRequestAndAuthorizedRequestTeam(
    @Args() request: TeamFiltersRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    this.logger.log({
      request,
      userWithContext,
      message: 'Fetching teams with filters',
    })

    const [{ level, ...filters }, queryOptions, connection] = this.relay.unmarshalRequest<
      TeamFiltersRequest,
      Team
    >(request)

    const queryLeveledHandlers = {
      default: async () =>
        this.queryGuard.getManyWithActionScopeConstraint(filters, userWithContext, queryOptions),
      [TeamLevelGraphQLEnum.COMPANY]: async () =>
        this.core.team.getUserCompanies(userWithContext, filters, queryOptions),
      [TeamLevelGraphQLEnum.COMPANY_OR_DEPARTMENT]: async () =>
        this.core.team.getUserCompaniesAndDepartments(userWithContext, filters, queryOptions),
    }

    const queryHandler = queryLeveledHandlers[level ?? 'default']
    const queryResult = await queryHandler()

    return this.relay.marshalResponse<Team>(queryResult, connection)
  }
}
