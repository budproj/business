import { Logger } from '@nestjs/common'
import { Args, Parent, ResolveField } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { KeyResultCommentInterface } from '@core/modules/key-result/comment/key-result-comment.interface'
import { KeyResultComment } from '@core/modules/key-result/comment/key-result-comment.orm-entity'
import { AuthorizedRequestUser } from '@interface/graphql/authorization/decorators/authorized-request-user.decorator'
import { GuardedMutation } from '@interface/graphql/authorization/decorators/guarded-mutation.decorator'
import { GuardedQuery } from '@interface/graphql/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/authorization/decorators/guarded-resolver.decorator'
import { PolicyGraphQLObject } from '@interface/graphql/authorization/objects/policy.object'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-node.resolver'
import { KeyResultCommentGraphQLNode } from '@interface/graphql/objects/key-result/comment/key-result-comment.node'
import { KeyResultCommentsGraphQLConnection } from '@interface/graphql/objects/key-result/comment/key-result-comments.connection'
import { KeyResultGraphQLNode } from '@interface/graphql/objects/key-result/key-result.node'
import { UserGraphQLNode } from '@interface/graphql/objects/user/user.node'

import { KeyResultCommentCreateRequest } from '../requests/key-result-comment-create.request'
import { KeyResultCommentDeleteRequest } from '../requests/key-result-comment-delete.request'
import { KeyResultCommentFiltersRequest } from '../requests/key-result-comment-filters.request'

@GuardedResolver(KeyResultCommentGraphQLNode)
export class KeyResultCommentGraphQLResolver extends GuardedNodeGraphQLResolver<
  KeyResultComment,
  KeyResultCommentInterface
> {
  private readonly logger = new Logger(KeyResultCommentGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.KEY_RESULT_COMMENT, core, core.keyResult.keyResultCommentProvider)
  }

  @GuardedQuery(KeyResultCommentsGraphQLConnection, 'key-result-comment:read', {
    name: 'keyResultComments',
  })
  protected async getKeyResultComments(
    @Args() request: KeyResultCommentFiltersRequest,
    @AuthorizedRequestUser() authorizedRequestUser: AuthorizationUser,
  ) {
    this.logger.log({
      request,
      authorizedRequestUser,
      message: 'Fetching key-result comments with filters',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      KeyResultCommentFiltersRequest,
      KeyResultComment
    >(request)

    const queryResult = await this.queryGuard.getManyWithActionScopeConstraint(
      filters,
      authorizedRequestUser,
      queryOptions,
    )

    return this.relay.marshalResponse<KeyResultComment>(queryResult, connection)
  }

  @GuardedMutation(KeyResultCommentGraphQLNode, 'key-result-comment:create', {
    name: 'createKeyResultComment',
  })
  protected async createKeyResultComment(
    @AuthorizedRequestUser() authorizedRequestUser: AuthorizationUser,
    @Args() request: KeyResultCommentCreateRequest,
  ) {
    this.logger.log({
      authorizedRequestUser,
      request,
      message: 'Received create comment request',
    })

    const isKeyResultActive = await this.core.keyResult.isActiveFromIndexes({
      id: request.data.keyResultId,
    })
    if (!isKeyResultActive)
      throw new UserInputError(
        'You cannot create this comment, because that key-result is not active anymore',
      )

    const comment = this.core.keyResult.createUserCommentData(authorizedRequestUser, request.data)
    const createdComments = await this.queryGuard.createWithActionScopeConstraint(
      comment,
      authorizedRequestUser,
    )
    if (!createdComments || createdComments.length === 0)
      throw new UserInputError('We were not able to create your comment')

    const createdComment = createdComments[0]

    return createdComment
  }

  @GuardedMutation(KeyResultCommentGraphQLNode, 'key-result-comment:delete', {
    name: 'deleteKeyResultComment',
  })
  protected async deleteKeyResultComment(
    @AuthorizedRequestUser() authorizedRequestUser: AuthorizationUser,
    @Args() request: KeyResultCommentDeleteRequest,
  ) {
    this.logger.log({
      authorizedRequestUser,
      request,
      message: 'Removing key result comment',
    })

    const keyResult = await this.core.keyResult.getFromKeyResultCommentID(request.id)
    if (!keyResult) throw new UserInputError('We were not able to find your key-result comment')

    const isKeyResultActive = await this.core.objective.isActiveFromIndexes({
      id: keyResult.objectiveId,
    })
    if (!isKeyResultActive)
      throw new UserInputError(
        'You cannot create this comment, because that key-result is not active anymore',
      )

    const selector = { id: request.id }
    const result = await this.queryGuard.deleteWithActionScopeConstraint(
      selector,
      authorizedRequestUser,
    )
    if (!result) throw new UserInputError('We were not able to find that comment to exclude')

    return result
  }

  @ResolveField('user', () => UserGraphQLNode)
  protected async getKeyResultCommentUser(@Parent() comment: KeyResultCommentGraphQLNode) {
    this.logger.log({
      comment,
      message: 'Fetching user for key result comment',
    })

    return this.core.user.getOne({ id: comment.userId })
  }

  @ResolveField('keyResult', () => KeyResultGraphQLNode)
  protected async getKeyResultCommentKeyResult(@Parent() comment: KeyResultCommentGraphQLNode) {
    this.logger.log({
      comment,
      message: 'Fetching key result for key result comment',
    })

    return this.core.keyResult.getOne({ id: comment.keyResultId })
  }

  protected async customizeEntityPolicy(
    originalPolicy: PolicyGraphQLObject,
    keyResultComment: KeyResultComment,
  ) {
    const restrictedToActivePolicy = await this.restrictPolicyToActiveKeyResult(
      originalPolicy,
      keyResultComment,
    )

    return restrictedToActivePolicy
  }

  private async restrictPolicyToActiveKeyResult(
    originalPolicy: PolicyGraphQLObject,
    keyResultComment: KeyResultComment,
  ) {
    if (this.policy.commandStatementIsDenyingAll(originalPolicy)) return originalPolicy

    const keyResult = await this.core.keyResult.getOne({ id: keyResultComment.keyResultId })
    const objective = await this.core.objective.getFromKeyResult(keyResult)
    const cycle = await this.core.cycle.getFromObjective(objective)

    return cycle.active ? originalPolicy : this.policy.denyCommandStatement(originalPolicy)
  }
}
