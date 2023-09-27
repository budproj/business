import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { TaskPlannerService } from '../domain/tasks/services/task-planner.service'

@Injectable()
export class AssignTasksJobScheduler {
  constructor(private readonly plannerService: TaskPlannerService) {}

  // Every Sunday at 00:00
  @Cron('40 21 * * 3')
  async assignTasks() {
    await this.plannerService.execute()
  }
}
