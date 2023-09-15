import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { KeyResultModule } from '@core/modules/key-result/key-result.module'

import { TaskAssignerService } from '../domain/tasks/services/assigner-task.service'
import { TaskPlannerService } from '../domain/tasks/services/task-planner.service'
import { AssignCheckinTask } from '../domain/tasks/use-cases/assign-task/assign-checkin-task'
import { AssignOutdatedKeyResultCommentTask } from '../domain/tasks/use-cases/assign-task/assign-outdated-key-result-comment-task'
import { MissionControlDatabaseModule } from '../infra/database/database.module'

import { AssignTasksJobScheduler } from './assign-tasks.job'

@Module({
  imports: [ScheduleModule.forRoot(), KeyResultModule, MissionControlDatabaseModule],
  providers: [
    AssignCheckinTask,
    AssignOutdatedKeyResultCommentTask,
    TaskPlannerService,
    TaskAssignerService,
    AssignTasksJobScheduler,
  ],
})
export class JobsScheduleModule {}
