import { Logger } from '@nestjs/common'
import { Args } from '@nestjs/graphql'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { AuthorizedRequestUser } from '@interface/graphql/adapters/authorization/decorators/authorized-request-user.decorator'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'

import { CycleGraphQLNode } from '../../cycle.node'
import { CycleFiltersRequest } from '../../requests/cycle-filters.request'

import { CyclesGraphQLConnection } from './cycles.connection'

@GuardedResolver(CyclesGraphQLConnection)
export class CyclesConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  Cycle,
  CycleInterface,
  CycleGraphQLNode
> {
  private readonly logger = new Logger(CyclesConnectionGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.CYCLE, core, core.cycle)
  }

  @GuardedQuery(CyclesGraphQLConnection, 'cycle:read', { name: 'cycles' })
  protected async getCyclesForRequestAndAuthorizedRequestUser(
    @Args() request: CycleFiltersRequest,
    @AuthorizedRequestUser() authorizationUser: AuthorizationUser,
  ) {
    this.logger.log({
      request,
      authorizationUser,
      message: 'Fetching teams with filters',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      CycleFiltersRequest,
      Cycle
    >(request)

    const userTeamsTree = await this.core.team.getTeamNodesTreeBeforeTeam(authorizationUser.teams)
    const queryResult = await this.core.cycle.getFromTeamsWithFilters(
      userTeamsTree,
      filters,
      queryOptions,
    )

    return this.relay.marshalResponse<Cycle>(queryResult, connection)
  }
}
