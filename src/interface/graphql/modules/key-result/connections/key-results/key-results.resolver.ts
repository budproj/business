import { Logger } from '@nestjs/common'
import { Args } from '@nestjs/graphql'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { AuthorizedRequestUser } from '@interface/graphql/adapters/authorization/decorators/authorized-request-user.decorator'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'

import { KeyResultGraphQLNode } from '../../key-result.node'
import { KeyResultFiltersRequest } from '../../requests/key-result-filters.request'

import { KeyResultsGraphQLConnection } from './key-results.connection'

@GuardedResolver(KeyResultsGraphQLConnection)
export class KeyResultsConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  KeyResult,
  KeyResultInterface,
  KeyResultGraphQLNode
> {
  private readonly logger = new Logger(KeyResultsConnectionGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.KEY_RESULT, core, core.keyResult)
  }

  @GuardedQuery(KeyResultsGraphQLConnection, 'key-result:read', { name: 'keyResults' })
  protected async getKeyResultsForRequestAndAuthorizedRequestUser(
    @Args() request: KeyResultFiltersRequest,
    @AuthorizedRequestUser() authorizationUser: AuthorizationUser,
  ) {
    this.logger.log({
      request,
      authorizationUser,
      message: 'Fetching key-results with filters',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      KeyResultFiltersRequest,
      KeyResult
    >(request)

    const queryResult = await this.queryGuard.getManyWithActionScopeConstraint(
      filters,
      authorizationUser,
      queryOptions,
    )

    return this.relay.marshalResponse<KeyResult>(queryResult, connection)
  }
}
