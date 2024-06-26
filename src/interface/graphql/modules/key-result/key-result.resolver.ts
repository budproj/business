import { Logger, UnauthorizedException } from '@nestjs/common'
import { Args, Parent, ResolveField } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { UpdatedKeyResultActivity } from '@adapters/activity/activities/updated-key-result-activity'
import { ProgressRecord } from '@adapters/analytics/progress-record.interface'
import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { Delta } from '@core/interfaces/delta.interface'
import { Status } from '@core/interfaces/status.interface'
import { KeyResultCheckInInterface } from '@core/modules/key-result/check-in/key-result-check-in.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'
import { KeyResultCheckMarkInterface } from '@core/modules/key-result/check-mark/key-result-check-mark.interface'
import { KeyResultCheckMark } from '@core/modules/key-result/check-mark/key-result-check-mark.orm-entity'
import { KeyResultCommentInterface } from '@core/modules/key-result/comment/key-result-comment.interface'
import { KeyResultComment } from '@core/modules/key-result/comment/key-result-comment.orm-entity'
import { KeyResultInterface } from '@core/modules/key-result/interfaces/key-result.interface'
import { KeyResult } from '@core/modules/key-result/key-result.orm-entity'
import { KeyResultUpdateInterface } from '@core/modules/key-result/update/key-result-update.interface'
import { KeyResultUpdate } from '@core/modules/key-result/update/key-result-update.orm-entity'
import { UserInterface } from '@core/modules/user/user.interface'
import { User } from '@core/modules/user/user.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { AttachActivity } from '@interface/graphql/adapters/activity/attach-activity.decorator'
import { RequestActivity } from '@interface/graphql/adapters/activity/request-activity.decorator'
import { GuardedMutation } from '@interface/graphql/adapters/authorization/decorators/guarded-mutation.decorator'
import { GuardedQuery } from '@interface/graphql/adapters/authorization/decorators/guarded-query.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-node.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'
import { KeyResultAccessControl } from '@interface/graphql/modules/key-result/access-control/key-result.access-control'
import { KeyResultCreateRequest } from '@interface/graphql/modules/key-result/requests/key-result-create.request'
import { ObjectiveGraphQLNode } from '@interface/graphql/modules/objective/objective.node'
import { TeamGraphQLNode } from '@interface/graphql/modules/team/team.node'
import { UserGraphQLNode } from '@interface/graphql/modules/user/user.node'
import { DeleteResultGraphQLObject } from '@interface/graphql/objects/delete-result.object'
import { DeltaGraphQLObject } from '@interface/graphql/objects/delta.object'
import { StatusGraphQLObject } from '@interface/graphql/objects/status.object'
import { ConnectionFiltersRequest } from '@interface/graphql/requests/connection-filters.request'
import { NodeDeleteRequest } from '@interface/graphql/requests/node-delete.request'
import { NodeIndexesRequest } from '@interface/graphql/requests/node-indexes.request'
import { StatusRequest } from '@interface/graphql/requests/status.request'

import { KeyResultCheckInFiltersRequest } from './check-in/requests/key-result-check-in-filters.request'
import { KeyResultCheckMarkFiltersRequest } from './check-mark/requests/key-result-check-mark-filters.request'
import { KeyResultCommentFiltersRequest } from './comment/requests/key-result-comment-filters.request'
import { KeyResultKeyResultCheckInsGraphQLConnection } from './connections/key-result-key-result-check-ins/key-result-key-result-check-ins.connection'
import { KeyResultKeyResultCheckMarkGraphQLConnection } from './connections/key-result-key-result-check-mark/key-result-key-result-check-marks.connection'
import { KeyResultKeyResultCommentsGraphQLConnection } from './connections/key-result-key-result-comments/key-result-key-result-comments.connection'
import { KeyResultKeyResultSupportTeamGraphQLConnection } from './connections/key-result-key-result-support-team/key-result-key-result-support-team.connection'
import { KeyResultKeyResultUpdatesGraphQLConnection } from './connections/key-result-key-result-updates/key-result-key-result-update.connection'
import { KeyResultProgressHistoryGraphQLConnection } from './connections/key-result-progress-history/key-result-progress-history.connection'
import { KeyResultTimelineGraphQLConnection } from './connections/key-result-timeline/key-result-key-result-timeline.connection'
import { KeyResultGraphQLNode } from './key-result.node'
import { KeyResultSupportTeamMembersFiltersRequest } from './requests/key-result-support-team-members-filters.request'
import { KeyResultUpdateRequest } from './requests/key-result-update.request'
import { KeyResultUpdateFiltersRequest } from './update/requests/key-result-update-filters.request'

@GuardedResolver(KeyResultGraphQLNode)
export class KeyResultGraphQLResolver extends GuardedNodeGraphQLResolver<
  KeyResult,
  KeyResultInterface
> {

  constructor(
    protected readonly core: CoreProvider,
    protected readonly corePorts: CorePortsProvider,
    protected readonly accessControl: KeyResultAccessControl,
  ) {
    super(Resource.KEY_RESULT, core, core.keyResult)
  }

  @GuardedQuery(KeyResultGraphQLNode, 'key-result:read', { name: 'keyResult' })
  protected async getKeyResultForRequestAndRequestUserWithContext(
    @Args() request: NodeIndexesRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const canRead = await this.accessControl.canRead(userWithContext, request.id)
    if (!canRead) throw new UnauthorizedException()

    const keyResult = await this.corePorts.dispatchCommand<KeyResult>('get-key-result', request)

    if (!keyResult)
      throw new UserInputError(`We could not found an key-result with the provided arguments`)

    return keyResult
  }

  @AttachActivity(UpdatedKeyResultActivity)
  @GuardedMutation(KeyResultGraphQLNode, 'key-result:update', { name: 'updateKeyResult' })
  protected async updateKeyResultForRequestAndRequestUserWithContext(
    @Args() request: KeyResultUpdateRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
    @RequestActivity() activity: UpdatedKeyResultActivity,
  ) {
    const canUpdate = await this.accessControl.canUpdate(userWithContext, request.id)
    if (!canUpdate) throw new UnauthorizedException()

    const originalKeyResult = await this.corePorts.dispatchCommand<KeyResult>('get-key-result', {
      id: request.id,
    })
    activity.attachToContext({
      originalKeyResult,
    })

    const keyResult = await this.corePorts.dispatchCommand<KeyResult>(
      'update-key-result',
      request.id,
      userWithContext,
      { ...request.data },
    )

    if (!keyResult)
      throw new UserInputError(`We could not found an key-result with ID ${request.id}`)

    return keyResult
  }

  @GuardedMutation(KeyResultGraphQLNode, 'key-result:create', { name: 'createKeyResult' })
  protected async createKeyResultForRequestUsingState(
    @Args() request: KeyResultCreateRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const canCreate = await this.accessControl.canCreate(
      userWithContext,
      request.data.teamId,
      request.data.ownerId,
    )
    if (!canCreate) throw new UnauthorizedException()

    const keyResult = await this.corePorts.dispatchCommand<KeyResult>('create-key-result', {
      ...request.data,
    })
    if (!keyResult) throw new UserInputError(`We could not create your Key Result`)

    return keyResult
  }

  @GuardedMutation(DeleteResultGraphQLObject, 'key-result:delete', { name: 'deleteKeyResult' })
  protected async deleteKeyResultForRequestUsingState(
    @Args() request: NodeDeleteRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const canDelete = await this.accessControl.canDelete(userWithContext, request.id)
    if (!canDelete) throw new UnauthorizedException()

    const deleteResult = await this.corePorts.dispatchCommand('delete-key-result', request.id)
    if (!deleteResult) throw new UserInputError('We could not delete your key-result')

    return deleteResult
  }

  @ResolveField('owner', () => UserGraphQLNode)
  protected async getOwnerForKeyResult(@Parent() keyResult: KeyResultGraphQLNode) {
    return this.core.user.getOne({ id: keyResult.ownerId })
  }

  @ResolveField('supportTeamMembers', () => KeyResultKeyResultSupportTeamGraphQLConnection)
  protected async getSupportTeamMembersForKeyResult(
    @Args() request: KeyResultSupportTeamMembersFiltersRequest,
    @Parent() keyResult: KeyResultGraphQLNode,
  ) {
    const [filters, queryOptions, connection] = this.relay.unmarshalRequest(request)

    const queryResult = await this.corePorts.dispatchCommand<User[]>(
      'get-key-result-support-team',
      keyResult.id,
    )

    return this.relay.marshalResponse<UserInterface>(queryResult, connection, keyResult)
  }

  @ResolveField('team', () => TeamGraphQLNode)
  protected async getTeamForKeyResult(@Parent() keyResult: KeyResultGraphQLNode) {
    return this.core.team.getOne({ id: keyResult.teamId })
  }

  @ResolveField('objective', () => ObjectiveGraphQLNode)
  protected async getObjectiveForKeyResult(@Parent() keyResult: KeyResultGraphQLNode) {
    return this.core.objective.getFromKeyResult(keyResult)
  }

  @ResolveField('keyResultComments', () => KeyResultKeyResultCommentsGraphQLConnection)
  protected async getKeyResultCommentsForKeyResult(
    @Args() request: KeyResultCommentFiltersRequest,
    @Parent() keyResult: KeyResult,
  ) {
    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      KeyResultCommentFiltersRequest,
      KeyResultComment
    >(request)

    const queryResult = await this.core.keyResult.getComments(keyResult, filters, queryOptions)

    return this.relay.marshalResponse<KeyResultCommentInterface>(queryResult, connection, keyResult)
  }

  @ResolveField('keyResultUpdates', () => KeyResultKeyResultUpdatesGraphQLConnection)
  protected async getKeyResultUpdatesForKeyResult(
    @Args() request: KeyResultUpdateFiltersRequest,
    @Parent() keyResult: KeyResult,
  ) {
    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      KeyResultUpdateFiltersRequest,
      KeyResultUpdate
    >(request)

    const queryResult = await this.core.keyResult.getUpdates(keyResult, filters, queryOptions)

    return this.relay.marshalResponse<KeyResultUpdateInterface>(queryResult, connection, keyResult)
  }

  @ResolveField('checkList', () => KeyResultKeyResultCheckMarkGraphQLConnection)
  protected async getKeyResultChecklistForKeyResult(
    @Args() request: KeyResultCheckMarkFiltersRequest,
    @Parent() keyResult: KeyResult,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const [filters, _, connection] = this.relay.unmarshalRequest<
      KeyResultCheckMarkFiltersRequest,
      KeyResultCheckMark
    >(request)

    if (keyResult?.checkMarks) {
      return this.relay.marshalResponse<KeyResultCheckMarkInterface>(
        keyResult?.checkMarks,
        connection,
        keyResult,
      )
    }

    const queryResult = await this.corePorts.dispatchCommand<KeyResultCheckMark[]>(
      'get-check-list-for-key-result',
      keyResult.id,
      filters.onlyAssignedToMe ? userWithContext.id : filters?.userId,
    )

    return this.relay.marshalResponse<KeyResultCheckMarkInterface>(
      queryResult,
      connection,
      keyResult,
    )
  }

  @ResolveField('keyResultCheckIns', () => KeyResultKeyResultCheckInsGraphQLConnection)
  protected async getKeyResultCheckInsForKeyResult(
    @Args() request: KeyResultCheckInFiltersRequest,
    @Parent() keyResult: KeyResult,
  ) {
    const [filters, queryOptions, connection] = this.relay.unmarshalRequest<
      KeyResultCommentFiltersRequest,
      KeyResultComment
    >(request)

    const queryResult = await this.core.keyResult.getCheckIns(keyResult, filters, queryOptions)

    return this.relay.marshalResponse<KeyResultCheckInInterface>(queryResult, connection, keyResult)
  }

  @ResolveField('timeline', () => KeyResultTimelineGraphQLConnection)
  protected async getKeyResultTimeline(
    @Args() request: ConnectionFiltersRequest,
    @Parent() keyResult: KeyResultGraphQLNode,
  ) {
    const connection = this.relay.unmarshalRequest<
      ConnectionFiltersRequest,
      KeyResultCheckIn | KeyResultComment | KeyResultUpdate
    >(request)[2]

    const queryResult = await this.core.keyResult.getTimeline(keyResult)

    return this.relay.marshalResponse(queryResult, connection, keyResult)
  }

  @ResolveField('status', () => StatusGraphQLObject)
  protected async getStatusForKeyResult(
    @Parent() keyResult: KeyResultGraphQLNode,
    @Args() request: StatusRequest,
  ) {
    const result = await this.corePorts.dispatchCommand<Status>(
      'get-key-result-status',
      keyResult.id,
      request,
    )
    if (!result)
      throw new UserInputError(
        `We could not find status for the key-result with ID ${keyResult.id}`,
      )

    return result
  }

  @ResolveField('delta', () => DeltaGraphQLObject)
  protected async getDeltaForObjective(@Parent() keyResult: KeyResultGraphQLNode) {
    const result = await this.corePorts.dispatchCommand<Delta>('get-key-result-delta', keyResult.id)
    if (!result)
      throw new UserInputError(
        `We could not find a delta for the key-result with ID ${keyResult.id}`,
      )

    return result
  }

  @ResolveField('progressHistory', () => KeyResultProgressHistoryGraphQLConnection)
  protected async getProgressHistoryForKeyResult(
    @Parent() keyResult: KeyResultGraphQLNode,
    @Args() request: ConnectionFiltersRequest,
  ) {
    const connection = this.relay.unmarshalRequest<ConnectionFiltersRequest, ProgressRecord>(
      request,
    )[2]

    const queryResult = await this.corePorts.dispatchCommand<ProgressRecord[]>(
      'get-key-result-progress-history',
      keyResult.id,
    )

    return this.relay.marshalResponse(queryResult, connection, keyResult)
  }

  @ResolveField('commentCount', () => String, { nullable: true })
  protected async stringfyExtra(@Parent() keyResult: KeyResultGraphQLNode) {
    return JSON.stringify(keyResult.commentCount)
  }
}
