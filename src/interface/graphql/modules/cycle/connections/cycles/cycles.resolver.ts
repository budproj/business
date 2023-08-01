import { Logger } from '@nestjs/common'
import { Args } from '@nestjs/graphql'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { Cycle } from '@core/modules/cycle/cycle.orm-entity'
import { CycleInterface } from '@core/modules/cycle/interfaces/cycle.interface'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'

import { CycleFiltersRequest } from '../../requests/cycle-filters.request'

import { CyclesGraphQLConnection } from './cycles.connection'

@GuardedResolver(CyclesGraphQLConnection)
export class CyclesConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<Cycle, CycleInterface> {
  private readonly logger = new Logger(CyclesConnectionGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.CYCLE, core, core.cycle)
  }

  @GuardedQuery(CyclesGraphQLConnection, 'cycle:read', { name: 'cycles' })
  protected async getCyclesForRequestAndRequestUserWithContext(
    @Args() request: CycleFiltersRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    this.logger.log({
      request,
      userWithContext,
      message: 'Fetching teams with filters',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<CycleFiltersRequest, Cycle>(request)

    const userTeamsTree = await this.core.team.getAscendantsByIds(
      userWithContext.teams.map(({ id }) => id),
      {},
    )
    const queryResult = await this.core.cycle.getFromTeamsWithFilters(userTeamsTree, filters, queryOptions)

    return this.relay.marshalResponse<Cycle>(queryResult, connection)
  }
}
