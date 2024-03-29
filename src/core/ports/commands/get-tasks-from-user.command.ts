import { GetOptions } from '@core/interfaces/get-options'
import { Task } from '@core/modules/task/task.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'

export interface Options {
  onlyUnchecked?: boolean
}

export class GetTasksFromUserCommand extends Command<Task[]> {
  public async execute(
    userId: User['id'],
    options?: Options,
    getOptions?: GetOptions<Task>,
  ): Promise<Task[]> {
    const shouldGetOnlyUnchecked = options?.onlyUnchecked ?? false

    return shouldGetOnlyUnchecked
      ? this.core.task.getAllUncheckedTasks(userId, getOptions)
      : this.core.task.getAllTasks(userId, getOptions)
  }
}
