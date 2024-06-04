import { Logger } from '@nestjs/common'
import { Args } from '@nestjs/graphql'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { KeyResultUpdateInterface } from '@core/modules/key-result/update/key-result-update.interface'
import { KeyResultUpdate } from '@core/modules/key-result/update/key-result-update.orm-entity'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'

import { KeyResultUpdateFiltersRequest } from '../../requests/key-result-update-filters.request'

import { KeyResultUpdatesGraphQLConnection } from './key-result-updates.connection'

@GuardedResolver(KeyResultUpdatesGraphQLConnection)
export class KeyResultUpdatesConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  KeyResultUpdate,
  KeyResultUpdateInterface
> {
  constructor(protected readonly core: CoreProvider) {
    super(Resource.KEY_RESULT, core, core.keyResult.keyResultUpdateProvider)
  }

  @GuardedQuery(KeyResultUpdatesGraphQLConnection, 'key-result:read', {
    name: 'keyResultUpdates',
  })
  protected async getKeyResultUpdatesForRequestAndRequestUserWithContext(
    @Args() request: KeyResultUpdateFiltersRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      KeyResultUpdateFiltersRequest,
      KeyResultUpdate
    >(request)

    const queryResult = await this.queryGuard.getManyWithActionScopeConstraint(
      filters,
      userWithContext,
      queryOptions,
    )

    return this.relay.marshalResponse<KeyResultUpdate>(queryResult, connection)
  }
}
