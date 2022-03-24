import { DeleteResult } from 'typeorm'

import { CoreEntityProvider } from '@core/entity.provider'
import { CoreQueryContext } from '@core/interfaces/core-query-context.interface'
import { UserProvider } from '@core/modules/user/user.provider'
import { CreationQuery } from '@core/types/creation-query.type'

import { TaskInterface, TaskStates } from './task.interface'
import { Task } from './task.orm-entity'
import { TaskRepository } from './task.repository'

export class TaskProvider extends CoreEntityProvider<Task, TaskInterface> {
  constructor(
    protected readonly repository: TaskRepository,
    protected readonly user: UserProvider,
  ) {
    super(TaskProvider.name, repository)
  }

  public async createTask(task: Partial<Task>): Promise<Task[]> {
    return this.create(task)
  }

  public async checkTask(id: string): Promise<Task> {
    return this.update({ id }, { state: TaskStates.CHECKED })
  }

  public async uncheckTask(id: string): Promise<Task> {
    return this.update({ id }, { state: TaskStates.UNCHECKED })
  }

  public async updateDescription(id: string, description: string): Promise<Task> {
    return this.update({ id }, { description })
  }

  public async deleteTaskById(id: string): Promise<DeleteResult> {
    return this.delete({ id })
  }

  public async getAllUncheckedTasks(assignedUserId: string): Promise<Task[]> {
    return this.getMany({ assignedUserId, state: TaskStates.UNCHECKED })
  }

  public async getAllTasks(assignedUserId: string): Promise<Task[]> {
    return this.getMany({ assignedUserId })
  }

  protected async protectCreationQuery(
    _query: CreationQuery<Task>,
    _data: Partial<TaskInterface>,
    _queryContext: CoreQueryContext,
  ) {
    return []
  }
}
