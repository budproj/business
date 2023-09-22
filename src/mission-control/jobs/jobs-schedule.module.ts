import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { TaskPlannerService } from '../domain/tasks/services/task-planner.service'
import { MissionControlDatabaseModule } from '../infra/database/database.module'
import { MessagingModule } from '../infra/messaging/messaging.module'

import { AssignTasksJobScheduler } from './assign-tasks.job'

@Module({
  imports: [ScheduleModule.forRoot(), MissionControlDatabaseModule, MessagingModule],
  providers: [TaskPlannerService, AssignTasksJobScheduler],
})
export class JobsScheduleModule {}
