import { Task } from '@core/modules/task/task.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'

export interface Options {
  onlyUnchecked?: boolean
}

export class GetTasksFromUserCommand extends Command<Task[]> {
  public async execute(userId: User['id'], options?: Options): Promise<Task[]> {
    const shouldGetOnlyUnchecked = options?.onlyUnchecked ?? false

    const queryToExecute = shouldGetOnlyUnchecked
      ? this.core.task.getAllTasks
      : this.core.task.getAllUncheckedTasks

    return queryToExecute(userId)
  }
}
