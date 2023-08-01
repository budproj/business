import { Resource } from '@adapters/policy/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'
import { ObjectiveKeyResultAccessControl } from '@interface/graphql/modules/objective/access-control/objective-key-result.access-control'

import { ObjectiveKeyResultsGraphQLConnection } from './objective-key-results.connection'

@GuardedResolver(ObjectiveKeyResultsGraphQLConnection)
export class ObjectiveKeyResultsConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  KeyResult,
  KeyResultInterface
> {
  constructor(
    protected readonly core: CoreProvider,
    accessControl: ObjectiveKeyResultAccessControl,
  ) {
    super(Resource.KEY_RESULT, core, core.keyResult, accessControl)
  }
}
