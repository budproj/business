import { Logger } from '@nestjs/common'
import { Args, Float, Int, Parent, ResolveField } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { Resource } from '@adapters/authorization/enums/resource.enum'
import { AuthorizationUser } from '@adapters/authorization/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { AuthorizedRequestUser } from '@interface/graphql/authorization/decorators/authorized-request-user.decorator'
import { GuardedMutation } from '@interface/graphql/authorization/decorators/guarded-mutation.decorator'
import { GuardedQuery } from '@interface/graphql/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/authorization/decorators/guarded-resolver.decorator'
import { PolicyGraphQLObject } from '@interface/graphql/authorization/objects/policy.object'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/authorization/resolvers/guarded-node.resolver'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'
import { KeyResultCheckInGraphQLNode } from '@interface/graphql/objects/key-result/check-in/key-result-check-in.node'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'

import { KeyResultGraphQLNode } from '../../key-result.node'
import { KeyResultCheckInCreateRequest } from '../requests/key-result-check-in-create.request'
import { KeyResultCheckInDeleteRequest } from '../requests/key-result-comment-delete.request'

@GuardedResolver(KeyResultCheckInGraphQLNode)
export class KeyResultCheckInGraphQLResolver extends GuardedNodeGraphQLResolver<
  KeyResultCheckIn,
  KeyResultCheckInInterface
> {
  private readonly logger = new Logger(KeyResultCheckInGraphQLResolver.name)

  constructor(protected readonly core: CoreProvider) {
    super(Resource.KEY_RESULT_CHECK_IN, core, core.keyResult.keyResultCheckInProvider)
  }

  @GuardedQuery(KeyResultCheckInGraphQLNode, 'key-result-check-in:read', {
    name: 'keyResultCheckIn',
  })
  protected async getCheckInForResquestAndAuthorizedRequestUser(
    @Args() request: NodeIndexesRequest,
    @AuthorizedRequestUser() authorizationUser: AuthorizationUser,
  ) {
    this.logger.log({
      request,
      message: 'Fetching key result check-in with provided indexes',
    })

    const keyResultCheckIn = await this.queryGuard.getOneWithActionScopeConstraint(
      request,
      authorizationUser,
    )
    if (!keyResultCheckIn)
      throw new UserInputError(`We could not found a check-in with the provided arguments`)

    return keyResultCheckIn
  }

  @GuardedMutation(KeyResultCheckInGraphQLNode, 'key-result-check-in:create', {
    name: 'createKeyResultCheckIn',
  })
  protected async createKeyResultCheckInForRequestAndAuthorizedRequestUser(
    @Args() request: KeyResultCheckInCreateRequest,
    @AuthorizedRequestUser() authorizationUser: AuthorizationUser,
  ) {
    this.logger.log({
      authorizationUser,
      request,
      message: 'Received create check-in request',
    })

    const isKeyResultActive = await this.core.keyResult.isActiveFromIndexes({
      id: request.data.keyResultId,
    })
    if (!isKeyResultActive)
      throw new UserInputError(
        'You cannot create this check-in, because that key-result is not active anymore',
      )

    const keyResultCheckIn = await this.core.keyResult.buildCheckInForUser(
      authorizationUser,
      request.data,
    )
    const createdCheckIns = await this.queryGuard.createWithActionScopeConstraint(
      keyResultCheckIn,
      authorizationUser,
    )

    this.logger.log({
      authorizationUser,
      keyResultCheckIn,
      message: 'Creating a new check-in in our database',
    })

    if (!createdCheckIns || createdCheckIns.length === 0)
      throw new UserInputError('We were not able to create your check-in')

    const createdCheckIn = createdCheckIns[0]

    return createdCheckIn
  }

  @GuardedMutation(KeyResultCheckInGraphQLNode, 'key-result-check-in:delete', {
    name: 'deleteKeyResultCheckIn',
  })
  protected async deleteKeyResultCheckInForRequestAndAuthorizedRequestUser(
    @Args() request: KeyResultCheckInDeleteRequest,
    @AuthorizedRequestUser() authorizationUser: AuthorizationUser,
  ) {
    this.logger.log({
      authorizationUser,
      request,
      message: 'Removing key result check-in',
    })

    const keyResult = await this.core.keyResult.getFromKeyResultCheckInID(request.id)
    if (!keyResult) throw new UserInputError('We were not able to find your key-result check-in')

    const isObjectiveActive = await this.core.objective.isActiveFromIndexes({
      id: keyResult.objectiveId,
    })
    if (!isObjectiveActive)
      throw new UserInputError(
        'You cannot delete this check-in, because that key-result is not active anymore',
      )

    const selector = { id: request.id }
    const result = await this.queryGuard.deleteWithActionScopeConstraint(
      selector,
      authorizationUser,
    )
    if (!result)
      throw new UserInputError(
        `We could not find any key result check-in with ${request.id} to delete`,
      )

    return result
  }

  @ResolveField('progress', () => Float)
  protected async getProgressForKeyResultCheckIn(
    @Parent() keyResultCheckIn: KeyResultCheckInGraphQLNode,
  ) {
    this.logger.log({
      keyResultCheckIn,
      message: 'Fetching relative percentage progress for key result check-in',
    })

    return this.core.keyResult.getCheckInProgress(keyResultCheckIn)
  }

  @ResolveField('progressIncrease', () => Float)
  protected async getPercentageProgressIncreaseForKeyResultCheckIn(
    @Parent() keyResultCheckIn: KeyResultCheckInGraphQLNode,
  ) {
    this.logger.log({
      keyResultCheckIn,
      message: 'Fetching percentage progress increase for key result check-in',
    })

    return this.core.keyResult.getCheckInProgressIncrease(keyResultCheckIn)
  }

  @ResolveField('confidenceIncrease', () => Int)
  protected async getAbsoluteConfidenceIncreaseForKeyResultCheckIn(
    @Parent() keyResultCheckIn: KeyResultCheckInGraphQLNode,
  ) {
    this.logger.log({
      keyResultCheckIn,
      message: 'Fetching absolute confidence increase for key result check-in',
    })

    return this.core.keyResult.getCheckInConfidenceIncrease(keyResultCheckIn)
  }

  @ResolveField('valueIncrease', () => Float)
  protected async getValueIncreaseForKeyResultCheckIn(
    @Parent() keyResultCheckIn: KeyResultCheckInGraphQLNode,
  ) {
    this.logger.log({
      keyResultCheckIn,
      message: 'Fetching value increase for key result check-in',
    })

    return this.core.keyResult.getCheckInValueIncrease(keyResultCheckIn)
  }

  @ResolveField('user', () => UserGraphQLNode)
  protected async getUserForKeyResultCheckIn(
    @Parent() keyResultCheckIn: KeyResultCheckInGraphQLNode,
  ) {
    this.logger.log({
      keyResultCheckIn,
      message: 'Fetching user for key result check-in',
    })

    return this.core.user.getOne({ id: keyResultCheckIn.userId })
  }

  @ResolveField('keyResult', () => KeyResultGraphQLNode)
  protected async getKeyResultForKeyResultCheckIn(
    @Parent() keyResultCheckIn: KeyResultCheckInGraphQLNode,
  ) {
    this.logger.log({
      keyResultCheckIn,
      message: 'Fetching key result for key result check-in',
    })

    return this.core.keyResult.getOne({ id: keyResultCheckIn.keyResultId })
  }

  @ResolveField('parent', () => KeyResultCheckInGraphQLNode, { nullable: true })
  protected async getParentForKeyResultCheckIn(
    @Parent() keyResultCheckIn: KeyResultCheckInGraphQLNode,
  ) {
    this.logger.log({
      keyResultCheckIn,
      message: 'Fetching parent for key result check-in',
    })

    return this.core.keyResult.getParentCheckInFromCheckIn(keyResultCheckIn)
  }

  protected async customizeEntityPolicy(
    originalPolicy: PolicyGraphQLObject,
    keyResultCheckIn: KeyResultCheckInGraphQLNode,
  ) {
    const restrictedToActivePolicy = await this.restrictPolicyToActiveKeyResult(
      originalPolicy,
      keyResultCheckIn,
    )

    return restrictedToActivePolicy
  }

  private async restrictPolicyToActiveKeyResult(
    originalPolicy: PolicyGraphQLObject,
    keyResultCheckIn: KeyResultCheckInGraphQLNode,
  ) {
    if (this.policy.commandStatementIsDenyingAll(originalPolicy)) return originalPolicy

    const isKeyResultActive = await this.core.keyResult.isActiveFromIndexes({
      id: keyResultCheckIn.keyResultId,
    })

    return isKeyResultActive ? originalPolicy : this.policy.denyCommandStatement(originalPolicy)
  }
}
