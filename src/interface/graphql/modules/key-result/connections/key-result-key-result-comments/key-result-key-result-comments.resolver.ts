import { Resource } from '@adapters/policy/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { KeyResultCommentInterface } from '@core/modules/key-result/comment/key-result-comment.interface'
import { KeyResultComment } from '@core/modules/key-result/comment/key-result-comment.orm-entity'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'
import { KeyResultCommentAccessControl } from '@interface/graphql/modules/key-result/access-control/key-result-comment.access-control'

import { KeyResultKeyResultCommentsGraphQLConnection } from './key-result-key-result-comments.connection'

@GuardedResolver(KeyResultKeyResultCommentsGraphQLConnection)
export class KeyResultKeyResultCommentsConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  KeyResultComment,
  KeyResultCommentInterface
> {
  constructor(protected readonly core: CoreProvider, accessControl: KeyResultCommentAccessControl) {
    super(Resource.KEY_RESULT_COMMENT, core, core.keyResult.keyResultCommentProvider, accessControl)
  }
}
