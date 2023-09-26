import { Injectable, OnApplicationBootstrap } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { TaskPlannerService } from '../domain/tasks/services/task-planner.service'

@Injectable()
export class AssignTasksJobScheduler implements OnApplicationBootstrap {
  constructor(private readonly plannerService: TaskPlannerService) {}

  async onApplicationBootstrap() {
    // Dispatch initial flow on startup
    await this.assignTasks()
  }

  // Every Sunday at 00:00
  @Cron('0 0 * * 0')
  async assignTasks() {
    await this.plannerService.execute()
  }
}
