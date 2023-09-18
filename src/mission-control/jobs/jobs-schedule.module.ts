import { Module } from '@nestjs/common'
import { ScheduleModule } from '@nestjs/schedule'

import { CoreModule } from '@core/core.module'

import { TaskAssignerService } from '../domain/tasks/services/assigner-task.service'
import { TaskPlannerService } from '../domain/tasks/services/task-planner.service'
import { AssignCheckinTask } from '../domain/tasks/use-cases/assign-task/assign-checkin-task'
import { AssignCommentOnBarrierKeyResultTask } from '../domain/tasks/use-cases/assign-task/assign-comment-on-barrier-kr'
import { AssignCommentOnKeyResultTask } from '../domain/tasks/use-cases/assign-task/assign-comment-on-key-result'
import { AssignEmptyDescriptionTask } from '../domain/tasks/use-cases/assign-task/assign-empty-description-key-result-task'
import { AssignOutdatedKeyResultCommentTask } from '../domain/tasks/use-cases/assign-task/assign-outdated-key-result-comment-task'
import { AssignCommentOnLowConfidenceKeyResultTask } from '../domain/tasks/use-cases/assign-task/assingn-comment-on-low-confidence-kr'
import { MissionControlDatabaseModule } from '../infra/database/database.module'

import { AssignTasksJobScheduler } from './assign-tasks.job'

@Module({
  imports: [ScheduleModule.forRoot(), MissionControlDatabaseModule, CoreModule],
  providers: [
    AssignCheckinTask,
    AssignEmptyDescriptionTask,
    AssignCommentOnKeyResultTask,
    AssignCommentOnLowConfidenceKeyResultTask,
    AssignCommentOnBarrierKeyResultTask,
    AssignOutdatedKeyResultCommentTask,
    TaskPlannerService,
    TaskAssignerService,
    AssignTasksJobScheduler,
  ],
})
export class JobsScheduleModule {}
