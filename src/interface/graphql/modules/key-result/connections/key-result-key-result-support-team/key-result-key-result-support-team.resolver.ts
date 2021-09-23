import { Resource } from '@adapters/policy/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { UserInterface } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'
import { KeyResultCommentAccessControl } from '@interface/graphql/modules/key-result/access-control/key-result-comment.access-control'

import { KeyResultKeyResultSupportTeamGraphQLConnection } from './key-result-key-result-support-team.connection'

@GuardedResolver(KeyResultKeyResultSupportTeamGraphQLConnection)
export class KeyResultKeyResultSupportTeamConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  User,
  UserInterface
> {
  constructor(protected readonly core: CoreProvider, accessControl: KeyResultCommentAccessControl) {
    super(Resource.KEY_RESULT_SUPPORT_TEAM, core, core.user, accessControl)
  }
}
