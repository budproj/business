import { Logger } from '@nestjs/common'
import { Args } from '@nestjs/graphql'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { AuthorizedRequestUser } from '@interface/graphql/authorization/decorators/authorized-request-user.decorator'
import { GuardedQuery } from '@interface/graphql/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-connection.resolver'

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
    super(Resource.USER, core, core.team)
  }

  @GuardedQuery(TeamsGraphQLConnection, 'team:read', { name: 'teams' })
  protected async getTeamsForRequestAndAuthorizedRequestTeam(
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
}
