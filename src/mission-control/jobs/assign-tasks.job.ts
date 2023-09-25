import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { TaskRepository } from '../domain/tasks/repositories/task-repositoriy'
import { TaskPlannerService } from '../domain/tasks/services/task-planner.service'

@Injectable()
export class AssignTasksJobScheduler {
  constructor(
    private readonly plannerService: TaskPlannerService,
    private readonly taskRepository: TaskRepository,
  ) {}

  // Every Sunday at 00:00
  @Cron('0 0 * * 0')
  async assignTasks() {
    await this.plannerService.execute()
  }

  @Cron('10 11 * * 1')
  async removeAll() {
    await this.taskRepository.removeAll()
  }
}
