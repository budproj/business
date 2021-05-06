import { Logger, UnauthorizedException } from '@nestjs/common'
import { Args, Parent, ResolveField } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { CreatedKeyResultCommentActivity } from '@adapters/activity/activities/created-key-result-comment.activity'
import { UserWithContext } from '@adapters/context/interfaces/user.interface'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { KeyResultCommentInterface } from '@core/modules/key-result/comment/key-result-comment.interface'
import { KeyResultComment } from '@core/modules/key-result/comment/key-result-comment.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { AttachActivity } from '@interface/graphql/adapters/activity/attach-activity.decorator'
import { GuardedMutation } from '@interface/graphql/adapters/authorization/decorators/guarded-mutation.decorator'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { PolicyGraphQLObject } from '@interface/graphql/adapters/authorization/objects/policy.object'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-node.resolver'
import { RequestState } from '@interface/graphql/adapters/context/decorators/request-state.decorator'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'
import { GraphQLRequestState } from '@interface/graphql/adapters/context/interfaces/request-state.interface'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'
import { DeleteResultGraphQLObject } from '@interface/graphql/objects/delete-result.object'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'

import { KeyResultGraphQLNode } from '../key-result.node'

import { KeyResultCommentAccessControl } from './key-result-comment.access-control'
import { KeyResultCommentGraphQLNode } from './key-result-comment.node'
import { KeyResultCommentCreateRequest } from './requests/key-result-comment-create.request'
import { KeyResultCommentDeleteRequest } from './requests/key-result-comment-delete.request'

@GuardedResolver(KeyResultCommentGraphQLNode)
export class KeyResultCommentGraphQLResolver extends GuardedNodeGraphQLResolver<
  KeyResultComment,
  KeyResultCommentInterface
> {
  private readonly logger = new Logger(KeyResultCommentGraphQLResolver.name)

  constructor(
    protected readonly core: CoreProvider,
    private readonly corePorts: CorePortsProvider,
    private readonly accessControl: KeyResultCommentAccessControl,
  ) {
    super(Resource.KEY_RESULT_COMMENT, core, core.keyResult.keyResultCommentProvider)
  }

  @GuardedQuery(KeyResultCommentGraphQLNode, 'key-result-comment:read', {
    name: 'keyResultComment',
  })
  protected async getKeyResultCommentForRequestAndRequestUserWithContext(
    @Args() request: NodeIndexesRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    this.logger.log({
      request,
      message: 'Fetching key-result comment with provided indexes',
    })

    const keyResultComment = await this.queryGuard.getOneWithActionScopeConstraint(
      request,
      userWithContext,
    )
    if (!keyResultComment)
      throw new UserInputError(
        `We could not found an key-result comment with the provided arguments`,
      )

    return keyResultComment
  }

  @AttachActivity(CreatedKeyResultCommentActivity)
  @GuardedMutation(KeyResultCommentGraphQLNode, 'key-result-comment:create', {
    name: 'createKeyResultComment',
  })
  protected async createKeyResultCommentForRequestAndRequestUserWithContext(
    @Args() request: KeyResultCommentCreateRequest,
    @RequestState() state: GraphQLRequestState,
  ) {
    const canCreate = await this.accessControl.canCreate(state.user, request.data)
    if (!canCreate) throw new UnauthorizedException()

    this.logger.log({
      state,
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

    const keyResultComment = this.core.keyResult.createUserCommentData(state.user, request.data)
    const createdComment = await this.corePorts.dispatchCommand<KeyResultComment>(
      'create-key-result-comment',
      keyResultComment,
    )

    if (!createdComment) throw new UserInputError('We were not able to create your comment')

    return createdComment
  }

  @GuardedMutation(DeleteResultGraphQLObject, 'key-result-comment:delete', {
    name: 'deleteKeyResultComment',
  })
  protected async deleteKeyResultCommentForRequestAndRequestUserWithContext(
    @RequestUserWithContext() userWithContext: UserWithContext,
    @Args() request: KeyResultCommentDeleteRequest,
  ) {
    this.logger.log({
      userWithContext,
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
    const result = await this.queryGuard.deleteWithActionScopeConstraint(selector, userWithContext)
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

  protected async controlNodePolicy(
    policy: PolicyGraphQLObject,
    keyResultComment: KeyResultCommentGraphQLNode,
  ) {
    const restrictedToActivePolicy = await this.restrictPolicyToActiveKeyResult(
      policy,
      keyResultComment,
    )

    return restrictedToActivePolicy
  }

  private async restrictPolicyToActiveKeyResult(
    policy: PolicyGraphQLObject,
    keyResultComment: KeyResultCommentGraphQLNode,
  ) {
    if (this.policy.commandStatementIsDenyingAll(policy)) return policy

    const isKeyResultActive = await this.core.keyResult.isActiveFromIndexes({
      id: keyResultComment.keyResultId,
    })

    return isKeyResultActive ? policy : this.policy.denyCommandStatement(policy)
  }
}
