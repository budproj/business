import { Resource } from '@adapters/authorization/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { GuardedResolver } from '@interface/graphql/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-connection.resolver'
import { KeyResultCheckInGraphQLNode } from '@interface/graphql/modules/key-result/check-in/key-result-check-in.node'

import { UserKeyResultCheckInsGraphQLConnection } from './user-key-result-check-ins.connection'

@GuardedResolver(UserKeyResultCheckInsGraphQLConnection)
export class UserKeyResultCheckInsConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  KeyResultCheckIn,
  KeyResultCheckInInterface,
  KeyResultCheckInGraphQLNode
> {
  constructor(protected readonly core: CoreProvider) {
    super(Resource.KEY_RESULT_CHECK_IN, core, core.keyResult.keyResultCheckInProvider)
  }
}