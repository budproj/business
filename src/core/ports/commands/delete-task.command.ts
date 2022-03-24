import { DeleteResult } from 'typeorm'

import { Command } from './base.command'

export class DeleteTaskCommand extends Command<DeleteResult> {
  public async execute(taskId: string): Promise<DeleteResult> {
    return this.core.task.deleteTaskById(taskId)
  }
}
