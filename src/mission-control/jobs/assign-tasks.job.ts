import { Injectable } from '@nestjs/common'
import { Cron } from '@nestjs/schedule'

import { TaskAssignerService } from '../domain/tasks/services/assigner-task.service'
import { TaskPlannerService } from '../domain/tasks/services/task-planner.service'

@Injectable()
export class AssignTasksJobScheduler {
  constructor(
    private readonly plannerService: TaskPlannerService,
    private readonly assignerService: TaskAssignerService,
  ) {}

  // TODO: change to 0 22 * * 0 (every Sunday at 22:00)
  @Cron('11 13 * * 5')
  async assignTasks() {
    await this.plannerService.execute()
  }
}
