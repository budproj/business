import { Logger, UnauthorizedException } from '@nestjs/common'
import { Args, Parent, ResolveField } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-fastify'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { CoreProvider } from '@core/core.provider'
import { Status } from '@core/interfaces/status.interface'
import { KeyResultCheckMarkInterface } from '@core/modules/key-result/check-mark/key-result-check-mark.interface'
import { KeyResultCheckMark } from '@core/modules/key-result/check-mark/key-result-check-mark.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { GuardedMutation } from '@interface/graphql/adapters/authorization/decorators/guarded-mutation.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-node.resolver'
import { RequestState } from '@interface/graphql/adapters/context/decorators/request-state.decorator'
import { GraphQLRequestState } from '@interface/graphql/adapters/context/interfaces/request-state.interface'
import { DeleteResultGraphQLObject } from '@interface/graphql/objects/delete-result.object'

import { UserGraphQLNode } from '../../user/user.node'
import { KeyResultCheckMarkAccessControl } from '../access-control/key-result-check-mark.access-control'

import { KeyResultCheckMarkGraphQLNode } from './key-result-check-mark.node'
import { KeyResultCheckMarkCreateRequest } from './requests/key-result-check-mark-create.request'
import { KeyResultCheckMarkDeleteRequest } from './requests/key-result-check-mark-delete.request'
import { KeyResultCheckMarkToggleRequest } from './requests/key-result-check-mark-toggle.request'
import { KeyResultCheckMarkUpdateAssigneeRequest } from './requests/key-result-check-mark-update-assignee.request'
import { KeyResultCheckMarkUpdateDescriptionRequest } from './requests/key-result-check-mark-update-description.request'

@GuardedResolver(KeyResultCheckMarkGraphQLNode)
export class KeyResultCheckMarkGraphQLResolver extends GuardedNodeGraphQLResolver<
  KeyResultCheckMark,
  KeyResultCheckMarkInterface
> {
  private readonly logger = new Logger(KeyResultCheckMarkGraphQLResolver.name)

  constructor(
    protected readonly core: CoreProvider,
    private readonly corePorts: CorePortsProvider,
    accessControl: KeyResultCheckMarkAccessControl,
  ) {
    super(
      Resource.KEY_RESULT_CHECK_MARK,
      core,
      core.keyResult.keyResultCheckMarkProvider,
      accessControl,
    )
  }

  @GuardedMutation(KeyResultCheckMarkGraphQLNode, 'key-result-check-mark:create', {
    name: 'createKeyResultCheckMark',
  })
  protected async createKeyResultCheckMark(
    @Args() request: KeyResultCheckMarkCreateRequest,
    @RequestState() state: GraphQLRequestState,
  ) {
    const canCreate = await this.accessControl.canCreate(state.user, request.data.keyResultId)
    if (!canCreate) throw new UnauthorizedException()

    this.logger.log({
      state,
      request,
      message: 'Received create check mark request',
    })

    const keyResultStatus = await this.corePorts.dispatchCommand<Status>(
      'get-key-result-status',
      request.data.keyResultId,
    )
    if (!keyResultStatus.isActive)
      throw new UserInputError(
        'You cannot create this keyResultCheckMark, because that key-result is not active anymore',
      )

    const createdCheckMark = await this.corePorts.dispatchCommand<KeyResultCheckMark>(
      'create-check-mark',
      { checkMark: request.data, user: state.user },
    )

    if (!createdCheckMark) throw new UserInputError('We were not able to create your comment')

    return createdCheckMark
  }

  @GuardedMutation(KeyResultCheckMarkGraphQLNode, 'key-result-check-mark:update', {
    name: 'toggleCheckMark',
  })
  protected async toggleCheckMark(
    @Args() request: KeyResultCheckMarkToggleRequest,
    @RequestState() state: GraphQLRequestState,
  ) {
    this.logger.log({
      state,
      request,
      message: 'Received toggle check mark request',
    })

    const toggledCheckMark = await this.corePorts.dispatchCommand<KeyResultCheckMark>(
      'toggle-check-mark',
      request.data,
    )

    if (!toggledCheckMark) throw new UserInputError('We were not able to toggle this check mark')

    return toggledCheckMark
  }

  @GuardedMutation(KeyResultCheckMarkGraphQLNode, 'key-result-check-mark:update', {
    name: 'updateCheckMarkDescription',
  })
  protected async updateCheckMarkDescription(
    @Args() request: KeyResultCheckMarkUpdateDescriptionRequest,
    @RequestState() state: GraphQLRequestState,
  ) {
    this.logger.log({
      state,
      request,
      message: 'Received update check mark description request',
    })

    const updatedCheckMark = await this.corePorts.dispatchCommand<KeyResultCheckMark>(
      'update-check-mark-description',
      { id: request.id, ...request.data },
    )

    if (!updatedCheckMark)
      throw new UserInputError('We were not able to update this check mark description')

    return updatedCheckMark
  }

  @GuardedMutation(KeyResultCheckMarkGraphQLNode, 'key-result-check-mark:update', {
    name: 'updateCheckMarkAssignee',
  })
  protected async updateCheckMarkAssignee(
    @Args() request: KeyResultCheckMarkUpdateAssigneeRequest,
    @RequestState() state: GraphQLRequestState,
  ) {
    this.logger.log({
      state,
      request,
      message: 'Received update check mark assignee request',
    })

    const updatedCheckMark = await this.corePorts.dispatchCommand<KeyResultCheckMark>(
      'update-check-mark-assignee',
      { id: request.id, ...request.data },
    )

    if (!updatedCheckMark)
      throw new UserInputError('We were not able to update this check mark assignee')

    return updatedCheckMark
  }

  @GuardedMutation(DeleteResultGraphQLObject, 'key-result-check-mark:delete', {
    name: 'deleteCheckMark',
  })
  protected async deleteCheckMark(
    @Args() request: KeyResultCheckMarkDeleteRequest,
    @RequestState() state: GraphQLRequestState,
  ) {
    this.logger.log({
      state,
      request,
      message: 'Received delete check mark request',
    })

    const deletedResponse = await this.corePorts.dispatchCommand<KeyResultCheckMark>(
      'delete-check-mark',
      request,
    )

    if (!deletedResponse) throw new UserInputError('We were not able to delete this check mark')

    return deletedResponse
  }

  @ResolveField('assignedUser', () => UserGraphQLNode)
  protected async getOwnerForKeyResult(@Parent() checkMark: KeyResultCheckMarkGraphQLNode) {
    this.logger.log({
      checkMark,
      message: 'Fetching user assigned to check mark',
    })

    const user = await this.corePorts.dispatchCommand<User>('get-user', {
      id: checkMark.assignedUserId,
    })

    return user
  }
}
