import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { TaskPlannerService } from '../domain/tasks/services/task-planner.service'

@Injectable()
export class AssignTasksJobScheduler {
  constructor(private readonly plannerService: TaskPlannerService) {}

  // TODO: change to 0 22 * * 0 (every Sunday at 22:00)
  @Cron('0 22 * * 0')
  async assignTasks() {
    await this.plannerService.execute()
  }
}
