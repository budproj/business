import { Task } from '@core/modules/task/task.orm-entity'

import { Command } from './base.command'

export class GetTaskByIdCommand extends Command<Task | undefined> {
  public async execute(taskId: string): Promise<Task | undefined> {
    return this.core.task.getTaskById(taskId)
  }
}
