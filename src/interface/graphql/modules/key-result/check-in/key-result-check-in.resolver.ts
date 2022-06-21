import { Logger, UnauthorizedException } from '@nestjs/common'
import { Args, Float, Parent, ResolveField } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { CreatedCheckInActivity } from '@adapters/activity/activities/created-check-in-activity'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { Status } from '@core/interfaces/status.interface'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { KeyResultCheckInDelta } from '@core/ports/commands/get-key-result-check-in-delta.command'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { AttachActivity } from '@interface/graphql/adapters/activity/attach-activity.decorator'
import { GuardedMutation } from '@interface/graphql/adapters/authorization/decorators/guarded-mutation.decorator'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-node.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'
import { KeyResultCheckInDeltaGraphQLObject } from '@interface/graphql/modules/key-result/check-in/objects/key-result-check-in-delta.object'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'
import { DeleteResultGraphQLObject } from '@interface/graphql/objects/delete-result.object'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'

import { KeyResultCheckInAccessControl } from '../access-control/key-result-check-in.access-control'
import { KeyResultGraphQLNode } from '../key-result.node'

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
    accessControl: KeyResultCheckInAccessControl,
  ) {
    super(
      Resource.KEY_RESULT_CHECK_IN,
      core,
      core.keyResult.keyResultCheckInProvider,
      accessControl,
    )
  }

  @GuardedQuery(KeyResultCheckInGraphQLNode, 'key-result-check-in:read', {
    name: 'keyResultCheckIn',
  })
  protected async resolveCheckInForRequestAndRequestUserWithContext(
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
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const canCreate = await this.accessControl.canCreate(userWithContext, request.data.keyResultId)
    if (!canCreate) throw new UnauthorizedException()

    this.logger.log({
      request,
      userWithContext,
      message: 'Received create check-in request',
    })

    const keyResultStatus = await this.corePorts.dispatchCommand<Status>(
      'get-key-result-status',
      request.data.keyResultId,
    )
    if (!keyResultStatus.isActive)
      throw new UserInputError(
        'You cannot create this check-in, because that key-result is not active anymore',
      )

    const keyResultCheckIn = await this.core.keyResult.buildCheckInForUser(
      userWithContext,
      request.data,
    )
    const createdCheckIn = await this.corePorts.dispatchCommand<KeyResultCheckIn>(
      'create-check-in',
      keyResultCheckIn,
    )

    if (!createdCheckIn) throw new UserInputError('We were not able to create your check-in')

    this.logger.log({
      userWithContext,
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

    const keyResultStatus = await this.corePorts.dispatchCommand<Status>(
      'get-key-result-status',
      keyResult.id,
    )
    if (!keyResultStatus.isActive)
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
  protected async resolveProgressForKeyResultCheckIn(
    @Parent() keyResultCheckIn: KeyResultCheckInGraphQLNode,
  ) {
    this.logger.log({
      keyResultCheckIn,
      message: 'Fetching relative percentage progress for key result check-in',
    })

    return this.core.keyResult.getCheckInProgress(keyResultCheckIn)
  }

  @ResolveField('user', () => UserGraphQLNode)
  protected async resolveUserForKeyResultCheckIn(
    @Parent() keyResultCheckIn: KeyResultCheckInGraphQLNode,
  ) {
    this.logger.log({
      keyResultCheckIn,
      message: 'Fetching user for key result check-in',
    })

    return this.core.user.getOne({ id: keyResultCheckIn.userId })
  }

  @ResolveField('keyResult', () => KeyResultGraphQLNode)
  protected async resolveKeyResultForKeyResultCheckIn(
    @Parent() keyResultCheckIn: KeyResultCheckInGraphQLNode,
  ) {
    this.logger.log({
      keyResultCheckIn,
      message: 'Fetching key result for key result check-in',
    })

    return this.core.keyResult.getOne({ id: keyResultCheckIn.keyResultId })
  }

  @ResolveField('parent', () => KeyResultCheckInGraphQLNode, { nullable: true })
  protected async resolveParentForKeyResultCheckIn(
    @Parent() keyResultCheckIn: KeyResultCheckInGraphQLNode,
  ) {
    this.logger.log({
      keyResultCheckIn,
      message: 'Fetching parent for key result check-in',
    })

    return this.core.keyResult.getParentCheckInFromCheckIn(keyResultCheckIn)
  }

  @ResolveField('delta', () => KeyResultCheckInDeltaGraphQLObject)
  protected async getDeltaForObjective(@Parent() keyResultCheckIn: KeyResultCheckInGraphQLNode) {
    this.logger.log({
      keyResultCheckIn,
      message: 'Fetching delta for this key-result check-in',
    })

    const result = await this.corePorts.dispatchCommand<KeyResultCheckInDelta>(
      'get-key-result-check-in-delta',
      keyResultCheckIn.id,
    )
    if (!result)
      throw new UserInputError(
        `We could not find a delta for the key-result check-in with ID ${keyResultCheckIn.id}`,
      )

    return result
  }
}
