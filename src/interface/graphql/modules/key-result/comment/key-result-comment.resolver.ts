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
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'

import { KeyResultGraphQLNode } from '../key-result.node'

import { KeyResultCommentsGraphQLConnection } from './connections/key-result-comments/key-result-comments.connection'
import { KeyResultCommentGraphQLNode } from './key-result-comment.node'
import { KeyResultCommentCreateRequest } from './requests/key-result-comment-create.request'
import { KeyResultCommentDeleteRequest } from './requests/key-result-comment-delete.request'
import { KeyResultCommentFiltersRequest } from './requests/key-result-comment-filters.request'

@GuardedResolver(KeyResultCommentGraphQLNode)
export class KeyResultCommentGraphQLResolver extends GuardedNodeGraphQLResolver<
  KeyResultComment,
  KeyResultCommentInterface
> {
  private readonly logger = new Logger(KeyResultCommentGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.KEY_RESULT_COMMENT, core, core.keyResult.keyResultCommentProvider)
  }

  @GuardedQuery(KeyResultCommentGraphQLNode, 'key-result-comment:read', {
    name: 'keyResultComment',
  })
  protected async getKeyResultCommentForRequestAndAuthorizedRequestUser(
    @Args() request: NodeIndexesRequest,
    @AuthorizedRequestUser() authorizationUser: AuthorizationUser,
  ) {
    this.logger.log({
      request,
      message: 'Fetching key-result comment with provided indexes',
    })

    const keyResultComment = await this.queryGuard.getOneWithActionScopeConstraint(
      request,
      authorizationUser,
    )
    if (!keyResultComment)
      throw new UserInputError(
        `We could not found an key-result comment with the provided arguments`,
      )

    return keyResultComment
  }

  @GuardedQuery(KeyResultCommentsGraphQLConnection, 'key-result-comment:read', {
    name: 'keyResultComments',
  })
  protected async getKeyResultCommentsForRequestAndAuthorizedRequestUser(
    @Args() request: KeyResultCommentFiltersRequest,
    @AuthorizedRequestUser() authorizationUser: AuthorizationUser,
  ) {
    this.logger.log({
      request,
      authorizationUser,
      message: 'Fetching key-result comments with filters',
    })

    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      KeyResultCommentFiltersRequest,
      KeyResultComment
    >(request)

    const queryResult = await this.queryGuard.getManyWithActionScopeConstraint(
      filters,
      authorizationUser,
      queryOptions,
    )

    return this.relay.marshalResponse<KeyResultComment>(queryResult, connection)
  }

  @GuardedMutation(KeyResultCommentGraphQLNode, 'key-result-comment:create', {
    name: 'createKeyResultComment',
  })
  protected async createKeyResultCommentForRequestAndAuthorizedRequestUser(
    @Args() request: KeyResultCommentCreateRequest,
    @AuthorizedRequestUser() authorizationUser: AuthorizationUser,
  ) {
    this.logger.log({
      authorizationUser,
      request,
      message: 'Received create comment request',
    })

    const isKeyResultActive = await this.core.keyResult.isActiveFromIndexes({
      id: request.data.keyResultId,
    })
    if (!isKeyResultActive)
      throw new UserInputError(
        'You cannot create this keyResultComment, because that key-result is not active anymore',
      )

    const keyResultComment = this.core.keyResult.createUserCommentData(
      authorizationUser,
      request.data,
    )
    const createdComments = await this.queryGuard.createWithActionScopeConstraint(
      keyResultComment,
      authorizationUser,
    )
    if (!createdComments || createdComments.length === 0)
      throw new UserInputError('We were not able to create your comment')

    const createdComment = createdComments[0]

    return createdComment
  }

  @GuardedMutation(KeyResultCommentGraphQLNode, 'key-result-comment:delete', {
    name: 'deleteKeyResultComment',
  })
  protected async deleteKeyResultCommentForRequestAndAuthorizedRequestUser(
    @AuthorizedRequestUser() authorizationUser: AuthorizationUser,
    @Args() request: KeyResultCommentDeleteRequest,
  ) {
    this.logger.log({
      authorizationUser,
      request,
      message: 'Removing key result comment',
    })

    const keyResult = await this.core.keyResult.getFromKeyResultCommentID(request.id)
    if (!keyResult) throw new UserInputError('We were not able to find your key-result comment')

    const isObjectiveActive = await this.core.objective.isActiveFromIndexes({
      id: keyResult.objectiveId,
    })
    if (!isObjectiveActive)
      throw new UserInputError(
        'You cannot create this keyResultComment, because that key-result is not active anymore',
      )

    const selector = { id: request.id }
    const result = await this.queryGuard.deleteWithActionScopeConstraint(
      selector,
      authorizationUser,
    )
    if (!result) throw new UserInputError('We were not able to find that comment to exclude')

    return result
  }

  @ResolveField('user', () => UserGraphQLNode)
  protected async getUserForKeyResultComment(
    @Parent() keyResultComment: KeyResultCommentGraphQLNode,
  ) {
    this.logger.log({
      keyResultComment,
      message: 'Fetching user for key result comment',
    })

    return this.core.user.getOne({ id: keyResultComment.userId })
  }

  @ResolveField('keyResult', () => KeyResultGraphQLNode)
  protected async getKeyResultForKeyResultComment(
    @Parent() keyResultComment: KeyResultCommentGraphQLNode,
  ) {
    this.logger.log({
      keyResultComment,
      message: 'Fetching key result for key result comment',
    })

    return this.core.keyResult.getOne({ id: keyResultComment.keyResultId })
  }

  protected async customizeEntityPolicy(
    originalPolicy: PolicyGraphQLObject,
    keyResultComment: KeyResultCommentGraphQLNode,
  ) {
    const restrictedToActivePolicy = await this.restrictPolicyToActiveKeyResult(
      originalPolicy,
      keyResultComment,
    )

    return restrictedToActivePolicy
  }

  private async restrictPolicyToActiveKeyResult(
    originalPolicy: PolicyGraphQLObject,
    keyResultComment: KeyResultCommentGraphQLNode,
  ) {
    if (this.policy.commandStatementIsDenyingAll(originalPolicy)) return originalPolicy

    const isKeyResultActive = await this.core.keyResult.isActiveFromIndexes({
      id: keyResultComment.keyResultId,
    })

    return isKeyResultActive ? originalPolicy : this.policy.denyCommandStatement(originalPolicy)
  }
}
