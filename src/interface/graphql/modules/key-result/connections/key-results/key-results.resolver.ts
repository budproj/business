import { Logger } from '@nestjs/common'
import { Args } from '@nestjs/graphql'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'
import { KeyResultAccessControl } from '@interface/graphql/modules/key-result/access-control/key-result.access-control'

import { KeyResultFiltersRequest } from '../../requests/key-result-filters.request'

import { KeyResultsGraphQLConnection } from './key-results.connection'

@GuardedResolver(KeyResultsGraphQLConnection)
export class KeyResultsConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  KeyResult,
  KeyResultInterface
> {
  private readonly logger = new Logger(KeyResultsConnectionGraphQLResolver.name)

  constructor(
    protected readonly core: CoreProvider,
    accessControl: KeyResultAccessControl,
    protected readonly corePorts: CorePortsProvider,
  ) {
    super(Resource.KEY_RESULT, core, core.keyResult, accessControl)
  }

  @GuardedQuery(KeyResultsGraphQLConnection, 'key-result:read', { name: 'keyResults' })
  protected async getKeyResultsForRequestAndRequestUserWithContext(
    @Args() request: KeyResultFiltersRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    this.logger.log({
      request,
      userWithContext,
      message: 'Fetching key-results with filters',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      KeyResultFiltersRequest,
      KeyResult
    >(request)

    const queryResult = await this.queryGuard.getManyWithActionScopeConstraint(
      filters,
      userWithContext,
      queryOptions,
    )

    return this.relay.marshalResponse<KeyResult>(queryResult, connection)
  }
}
