import { TaskStates } from '@core/modules/task/task.interface'
import { Task } from '@core/modules/task/task.orm-entity'
import { User } from '@core/modules/user/user.orm-entity'

import { Command } from './base.command'

interface CommandInput {
  task: Partial<Task>
  userId: User['id']
}

export class CreateTaskCommand extends Command<Task> {
  public async execute({ task, userId }: CommandInput): Promise<Task> {
    const builtTask = {
      description: task.description,
      state: TaskStates.UNCHECKED,
      assignedUserId: userId,
      userId,
    }

    const [newTask] = await this.core.task.createTask(builtTask)

    return newTask
  }
}
