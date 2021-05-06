import { Logger, UnauthorizedException } from '@nestjs/common'
import { Args, Float, Int, Parent, ResolveField } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { CreatedCheckInActivity } from '@adapters/activity/activities/created-check-in-activity'
import { UserWithContext } from '@adapters/context/interfaces/user.interface'
import { Command } from '@adapters/policy/enums/command.enum'
import { Effect } from '@adapters/policy/enums/effect.enum'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
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

import { KeyResultCheckInAccessControl } from './key-result-check-in.access-control'
import { KeyResultCheckInGraphQLNode } from './key-result-check-in.node'
import { KeyResultCheckInCreateRequest } from './requests/key-result-check-in-create.request'
import { KeyResultCheckInDeleteRequest } from './requests/key-result-comment-delete.request'

@GuardedResolver(KeyResultCheckInGraphQLNode)
export class KeyResultCheckInGraphQLResolver extends GuardedNodeGraphQLResolver<
  KeyResultCheckIn,
  KeyResultCheckInInterface
> {
  private readonly logger = new Logger(KeyResultCheckInGraphQLResolver.name)

  constructor(
    protected readonly core: CoreProvider,
    private readonly corePorts: CorePortsProvider,
    private readonly accessControl: KeyResultCheckInAccessControl,
  ) {
    super(Resource.KEY_RESULT_CHECK_IN, core, core.keyResult.keyResultCheckInProvider)
  }

  @GuardedQuery(KeyResultCheckInGraphQLNode, 'key-result-check-in:read', {
    name: 'keyResultCheckIn',
  })
  protected async getCheckInForResquestAndRequestUserWithContext(
    @Args() request: NodeIndexesRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    this.logger.log({
      request,
      message: 'Fetching key result check-in with provided indexes',
    })

    const keyResultCheckIn = await this.queryGuard.getOneWithActionScopeConstraint(
      request,
      userWithContext,
    )
    if (!keyResultCheckIn)
      throw new UserInputError(`We could not found a check-in with the provided arguments`)

    return keyResultCheckIn
  }

  @AttachActivity(CreatedCheckInActivity)
  @GuardedMutation(KeyResultCheckInGraphQLNode, 'key-result-check-in:create', {
    name: 'createKeyResultCheckIn',
  })
  protected async createKeyResultCheckInForRequestAndRequestUserWithContext(
    @Args() request: KeyResultCheckInCreateRequest,
    @RequestState() state: GraphQLRequestState,
  ) {
    const canCreate = await this.accessControl.canCreate(state.user, request.data)
    if (!canCreate) throw new UnauthorizedException()

    this.logger.log({
      request,
      state,
      message: 'Received create check-in request',
    })

    const isKeyResultActive = await this.core.keyResult.isActiveFromIndexes({
      id: request.data.keyResultId,
    })
    if (!isKeyResultActive)
      throw new UserInputError(
        'You cannot create this check-in, because that key-result is not active anymore',
      )

    const keyResultCheckIn = await this.core.keyResult.buildCheckInForUser(state.user, request.data)
    const createdCheckIn = await this.corePorts.dispatchCommand<KeyResultCheckIn>(
      'create-check-in',
      keyResultCheckIn,
    )

    if (!createdCheckIn) throw new UserInputError('We were not able to create your check-in')

    this.logger.log({
      state,
      keyResultCheckIn,
      message: 'Created a new check-in in our database',
    })

    return createdCheckIn
  }

  @GuardedMutation(DeleteResultGraphQLObject, 'key-result-check-in:delete', {
    name: 'deleteKeyResultCheckIn',
  })
  protected async deleteKeyResultCheckInForRequestAndRequestUserWithContext(
    @Args() request: KeyResultCheckInDeleteRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    this.logger.log({
      userWithContext,
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
    const result = await this.queryGuard.deleteWithActionScopeConstraint(selector, userWithContext)
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

  protected async controlNodePolicy(
    policy: PolicyGraphQLObject,
    keyResultCheckIn: KeyResultCheckInGraphQLNode,
  ) {
    const restrictedToActivePolicy = await this.restrictPolicyToActiveKeyResult(
      policy,
      keyResultCheckIn,
    )
    const restrictedToLatestCheckInDelete = await this.restrictDeletePolicyToAllowOnlyLatestCheckIn(
      restrictedToActivePolicy,
      keyResultCheckIn,
    )

    return restrictedToLatestCheckInDelete
  }

  private async restrictPolicyToActiveKeyResult(
    policy: PolicyGraphQLObject,
    keyResultCheckIn: KeyResultCheckInGraphQLNode,
  ) {
    if (this.policy.commandStatementIsDenyingAll(policy)) return policy

    const isKeyResultActive = await this.core.keyResult.isActiveFromIndexes({
      id: keyResultCheckIn.keyResultId,
    })

    return isKeyResultActive ? policy : this.policy.denyCommandStatement(policy)
  }

  private async restrictDeletePolicyToAllowOnlyLatestCheckIn(
    policy: PolicyGraphQLObject,
    keyResultCheckIn: KeyResultCheckInGraphQLNode,
  ) {
    const keyResult = await this.core.keyResult.getOne({ id: keyResultCheckIn.keyResultId })
    const latestCheckIn = await this.core.keyResult.getLatestCheckInForKeyResultAtDate(keyResult)

    const controlledDeletePolicy =
      latestCheckIn.id === keyResultCheckIn.id ? Effect.ALLOW : Effect.DENY

    return {
      ...policy,
      [Command.DELETE]: controlledDeletePolicy,
    }
  }
}
