import { Logger, NotFoundException, UnauthorizedException } from '@nestjs/common'
import { Args } from '@nestjs/graphql'
import { UserInputError } from 'apollo-server-core'

import { Resource } from '@adapters/policy/enums/resource.enum'
import { UserWithContext } from '@adapters/state/interfaces/user.interface'
import { CoreProvider } from '@core/core.provider'
import { TaskInterface } from '@core/modules/task/task.interface'
import { Task } from '@core/modules/task/task.orm-entity'
import { CorePortsProvider } from '@core/ports/ports.provider'
import { GuardedMutation } from '@interface/graphql/adapters/authorization/decorators/guarded-mutation.decorator'
import { GuardedResolver } from '@interface/graphql/adapters/authorization/decorators/guarded-resolver.decorator'
import { GuardedNodeGraphQLResolver } from '@interface/graphql/adapters/authorization/resolvers/guarded-node.resolver'
import { RequestUserWithContext } from '@interface/graphql/adapters/context/decorators/request-user-with-context.decorator'
import { DeleteResultGraphQLObject } from '@interface/graphql/objects/delete-result.object'

import { UserAccessControl } from '../user.access-control'

import { TaskCreateRequest } from './requests/task-create.requests'
import { TaskDeleteRequest } from './requests/task-delete.request'
import { TaskToggleRequest } from './requests/task-toggle.request'
import { TaskUpdateDescriptionRequest } from './requests/task-update-description.request'
import { TaskGraphQLNode } from './task.node'

@GuardedResolver(TaskGraphQLNode)
export class TaskGraphQLResolver extends GuardedNodeGraphQLResolver<Task, TaskInterface> {
  constructor(
    protected readonly core: CoreProvider,
    protected accessControl: UserAccessControl,
    private readonly corePorts: CorePortsProvider,
  ) {
    super(Resource.USER_TASK, core, core.task, accessControl)
  }

  @GuardedMutation(TaskGraphQLNode, 'user:update', { name: 'createTask' })
  protected async createTask(
    @Args() request: TaskCreateRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const canUpdate = await this.accessControl.canUpdate(userWithContext, userWithContext.id)
    if (!canUpdate) throw new UnauthorizedException()

    const task = await this.corePorts.dispatchCommand<Task>('create-task', {
      task: request,
      userId: userWithContext.id,
    })

    return task
  }

  @GuardedMutation(TaskGraphQLNode, 'user:update', { name: 'toggleTask' })
  protected async toggleTask(
    @Args() request: TaskToggleRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const oldTask = await this.corePorts.dispatchCommand<Task | undefined>(
      'get-task-by-id',
      request.id,
    )
    if (!oldTask) throw new NotFoundException('We were not able to find this task')

    const canUpdate = await this.accessControl.canUpdate(userWithContext, oldTask?.assignedUserId)
    if (!canUpdate) throw new UnauthorizedException()

    const task = await this.corePorts.dispatchCommand<Task>(
      'toggle-task',
      request,
      userWithContext.id,
    )

    return task
  }

  @GuardedMutation(DeleteResultGraphQLObject, 'user:update', { name: 'deleteTask' })
  protected async deleteTask(
    @Args() request: TaskDeleteRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const oldTask = await this.corePorts.dispatchCommand<Task | undefined>(
      'get-task-by-id',
      request.id,
    )
    if (!oldTask) throw new NotFoundException('We were not able to find this task')

    const canUpdate = await this.accessControl.canUpdate(userWithContext, oldTask?.assignedUserId)
    if (!canUpdate) throw new UnauthorizedException()

    const deletedTask = await this.corePorts.dispatchCommand<Task>('delete-task', request.id)

    if (!deletedTask) throw new UserInputError('We were not able to delete this task')

    return deletedTask
  }

  @GuardedMutation(TaskGraphQLNode, 'user:update', { name: 'updateTaskDescription' })
  protected async updateTaskDescription(
    @Args() request: TaskUpdateDescriptionRequest,
    @RequestUserWithContext() userWithContext: UserWithContext,
  ) {
    const oldTask = await this.corePorts.dispatchCommand<Task | undefined>(
      'get-task-by-id',
      request.id,
    )
    if (!oldTask) throw new NotFoundException('We were not able to find this task')

    const canUpdate = await this.accessControl.canUpdate(userWithContext, oldTask?.assignedUserId)

    if (!canUpdate) throw new UnauthorizedException()

    const task = await this.corePorts.dispatchCommand<Task>(
      'update-task-description',
      request,
      userWithContext.id,
    )

    return task
  }
}
