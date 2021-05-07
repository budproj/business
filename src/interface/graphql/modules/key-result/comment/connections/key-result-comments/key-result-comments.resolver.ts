import { Logger } from '@nestjs/common'
import { Args } from '@nestjs/graphql'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { KeyResultCommentInterface } from '@core/modules/key-result/comment/key-result-comment.interface'
import { KeyResultComment } from '@core/modules/key-result/comment/key-result-comment.orm-entity'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedConnectionGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-connection.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'

import { KeyResultCommentGraphQLNode } from '../../key-result-comment.node'
import { KeyResultCommentFiltersRequest } from '../../requests/key-result-comment-filters.request'

import { KeyResultCommentsGraphQLConnection } from './key-result-comments.connection'

@GuardedResolver(KeyResultCommentsGraphQLConnection)
export class KeyResultCommentsConnectionGraphQLResolver extends GuardedConnectionGraphQLResolver<
  KeyResultComment,
  KeyResultCommentInterface,
  KeyResultCommentGraphQLNode
> {
  private readonly logger = new Logger(KeyResultCommentsConnectionGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.KEY_RESULT_COMMENT, core, core.keyResult.keyResultCommentProvider)
  }

  @GuardedQuery(KeyResultCommentsGraphQLConnection, 'key-result-comment:read', {
    name: 'keyResultComments',
  })
  protected async getKeyResultCommentsForRequestAndRequestUserWithContext(
    @Args() request: KeyResultCommentFiltersRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    this.logger.log({
      request,
      userWithContext,
      message: 'Fetching key-result comments with filters',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      KeyResultCommentFiltersRequest,
      KeyResultComment
    >(request)

    const queryResult = await this.queryGuard.getManyWithActionScopeConstraint(
      filters,
      userWithContext,
      queryOptions,
    )

    return this.relay.marshalResponse<KeyResultComment>(queryResult, connection)
  }
}
