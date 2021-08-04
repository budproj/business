import { Resource } from '@adapters/policy/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { KeyResultCheckMarkInterface } from '@core/modules/key-result/check-mark/key-result-check-mark.interface'
import { KeyResultCheckMark } from '@core/modules/key-result/check-mark/key-result-check-mark.orm-entity'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'
import { KeyResultCheckMarkAccessControl } from '../../access-control/key-result-check-mark.access-control'

import { KeyResultKeyResultCheckMarkGraphQLConnection } from './key-result-key-result-check-marks.connection'

@GuardedResolver(KeyResultKeyResultCheckMarkGraphQLConnection)
export class KeyResultKeyResultCheckMarksConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
KeyResultCheckMark,
KeyResultCheckMarkInterface
> {
  constructor(protected readonly core: CoreProvider, accessControl: KeyResultCheckMarkAccessControl) {
    super(Resource.KEY_RESULT_CHECK_MARK, core, core.keyResult.keyResultCheckMarkProvider, accessControl)
  }
}
