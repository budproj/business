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

  // TODO: change to 0 22 * * 0 (every Sunday at 22:00)
  @Cron('0 22 * * 0')
  async assignTasks() {
    await this.plannerService.execute()
  }

  @Cron('25 10 * * 1')
  async removeAll() {
    await this.taskRepository.removeAll()
  }
}
