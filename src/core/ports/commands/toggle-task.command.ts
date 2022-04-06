import { TaskStates } from '@core/modules/task/task.interface'
import { Task } from '@core/modules/task/task.orm-entity'

import { Command } from './base.command'

export class ToggleTaskCommand extends Command<Task> {
  public async execute(task: Partial<Task>): Promise<Task> {
    const { state: previousTaskState } = await this.core.task.getOne({ id: task.id })

    const possibleActions = {
      [TaskStates.UNCHECKED]: async (id: string) => this.core.task.checkTask(id),
      [TaskStates.CHECKED]: async (id: string) => this.core.task.uncheckTask(id),
    }

    const action = possibleActions[previousTaskState]

    return action(task.id)
  }
}
