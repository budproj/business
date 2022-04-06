import { Task } from '@core/modules/task/task.orm-entity'

import { Command } from './base.command'

export class UpdateTaskDescriptionCommand extends Command<Task> {
  public async execute(checkMark: Partial<Task>): Promise<Task> {
    return this.core.task.updateDescription(checkMark.id, checkMark.description)
  }
}
