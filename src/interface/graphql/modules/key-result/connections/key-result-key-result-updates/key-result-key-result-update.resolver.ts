import { Resource } from '@adapters/policy/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { KeyResultUpdateInterface } from '@core/modules/key-result/update/key-result-update.interface'
import { KeyResultUpdate } from '@core/modules/key-result/update/key-result-update.orm-entity'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'

import { KeyResultAccessControl } from '../../access-control/key-result.access-control'

import { KeyResultKeyResultUpdatesGraphQLConnection } from './key-result-key-result-update.connection'

@GuardedResolver(KeyResultKeyResultUpdatesGraphQLConnection)
export class KeyResultKeyResultUpdatesConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  KeyResultUpdate,
  KeyResultUpdateInterface
> {
  constructor(protected readonly core: CoreProvider, accessControl: KeyResultAccessControl) {
    super(Resource.KEY_RESULT, core, core.keyResult.keyResultUpdateProvider, accessControl)
  }
}
