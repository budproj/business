import { Resource } from '@adapters/policy/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'
import { KeyResultCheckInAccessControl } from '@interface/graphql/modules/key-result/access-control/key-result-check-in.access-control'

import { KeyResultProgressHistoryGraphQLConnection } from './key-result-progress-history.connection'

@GuardedResolver(KeyResultProgressHistoryGraphQLConnection)
export class KeyResultProgressHistoryConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  KeyResult,
  KeyResultInterface
> {
  constructor(protected readonly core: CoreProvider, accessControl: KeyResultCheckInAccessControl) {
    super(Resource.KEY_RESULT, core, core.keyResult, accessControl)
  }
}
