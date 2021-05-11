import { Logger } from '@nestjs/common'
import { Args } from '@nestjs/graphql'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'

import { KeyResultCheckInFiltersRequest } from '../../requests/key-result-check-in-filters.request'

import { KeyResultCheckInsGraphQLConnection } from './key-result-check-ins.connection'

@GuardedResolver(KeyResultCheckInsGraphQLConnection)
export class KeyResultCheckInsConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  KeyResultCheckIn,
  KeyResultCheckInInterface
> {
  private readonly logger = new Logger(KeyResultCheckInsConnectionGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.KEY_RESULT_CHECK_IN, core, core.keyResult.keyResultCheckInProvider)
  }

  @GuardedQuery(KeyResultCheckInsGraphQLConnection, 'key-result-check-in:read', {
    name: 'keyResultCheckIns',
  })
  protected async getKeyResultCheckInsForRequestAndRequestUserWithContext(
    @Args() request: KeyResultCheckInFiltersRequest,
    @RequestUserWithContext()
    authorizedRequestKeyResultCheckIn: UserWithContext,
  ) {
    this.logger.log({
      request,
      authorizedRequestKeyResultCheckIn,
      message: 'Fetching key-result check-ins with filters',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      KeyResultCheckInFiltersRequest,
      KeyResultCheckIn
    >(request)

    const queryResult = await this.queryGuard.getManyWithActionScopeConstraint(
      filters,
      authorizedRequestKeyResultCheckIn,
      queryOptions,
    )

    return this.relay.marshalResponse<KeyResultCheckIn>(queryResult, connection)
  }
}
