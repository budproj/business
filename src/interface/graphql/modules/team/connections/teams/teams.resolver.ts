import { Logger } from '@nestjs/common'
import { Args } from '@nestjs/graphql'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { TeamInterface } from '@core/modules/team/interfaces/team.interface'
import { Team } from '@core/modules/team/team.orm-entity'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'

import { TeamLevelGraphQLEnum } from '../../enums/team-level.enum'
import { TeamFiltersRequest } from '../../requests/team-filters.request'

import { TeamsGraphQLConnection } from './teams.connection'
import { Stopwatch } from "@lib/logger/pino.decorator";
import { Cacheable } from "@lib/cache/cacheable.decorator";

@GuardedResolver(TeamsGraphQLConnection)
export class TeamsConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  Team,
  TeamInterface
> {
  constructor(protected readonly core: CoreProvider) {
    super(Resource.TEAM, core, core.team)
  }

  @Cacheable((request, user) => [user.id, request], 1 * 60)
  @Stopwatch()
  @GuardedQuery(TeamsGraphQLConnection, 'team:read', { name: 'teams' })
  protected async getTeamsForRequestAndAuthorizedRequestTeam(
    @Args() request: TeamFiltersRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
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
