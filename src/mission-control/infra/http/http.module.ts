import { Module } from '@nestjs/common'

import { CoreModule } from '@core/core.module'
import { KeyResultModule } from '@core/modules/key-result/key-result.module'
import { UserModule } from '@core/modules/user/user.module'
import { TaskAssignerService } from 'src/mission-control/domain/tasks/services/assigner-task.service'
import { TaskFulfillerService } from 'src/mission-control/domain/tasks/services/fulfiller-task.service'
import { TaskPlannerService } from 'src/mission-control/domain/tasks/services/task-planner.service'
import TasksService from 'src/mission-control/domain/tasks/services/tasks.service'
import { AssignCheckinTask } from 'src/mission-control/domain/tasks/use-cases/assign-task/assign-checkin-task'
import { AssignCommentOnBarrierKeyResultTask } from 'src/mission-control/domain/tasks/use-cases/assign-task/assign-comment-on-barrier-kr'
import { AssignCommentOnKeyResultTask } from 'src/mission-control/domain/tasks/use-cases/assign-task/assign-comment-on-key-result'
import { AssignEmptyDescriptionTask } from 'src/mission-control/domain/tasks/use-cases/assign-task/assign-empty-description-key-result-task'
import { AssignCommentOnLowConfidenceKeyResultTask } from 'src/mission-control/domain/tasks/use-cases/assign-task/assingn-comment-on-low-confidence-kr'
import { FulfillCheckinTask } from 'src/mission-control/domain/tasks/use-cases/fulfill-task/fulfil-checkin-task'

import { MissionControlDatabaseModule } from '../database/database.module'

import { AddHTTPContextToUserInterceptor } from './context/interceptors/add-http-context-to-user.interceptor'
import { TasksController } from './controllers/tasks.controller'

@Module({
  imports: [MissionControlDatabaseModule, KeyResultModule, UserModule, CoreModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    TaskPlannerService,
    TaskAssignerService,
    TaskFulfillerService,
    FulfillCheckinTask,
    AssignCheckinTask,
    AssignEmptyDescriptionTask,
    AssignCommentOnKeyResultTask,
    AssignCommentOnLowConfidenceKeyResultTask,
    AssignCommentOnBarrierKeyResultTask,
    AddHTTPContextToUserInterceptor,
  ],
})
export class HttpModule {}
