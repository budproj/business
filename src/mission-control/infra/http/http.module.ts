import { Module } from '@nestjs/common'

import { CoreModule } from '@core/core.module'
import { UserModule } from '@core/modules/user/user.module'
import { TaskFulfillerService } from 'src/mission-control/domain/tasks/services/fulfiller-task.service'
import TasksService from 'src/mission-control/domain/tasks/services/tasks.service'
import TeamScoreProcessorService from 'src/mission-control/domain/tasks/services/team-score-processor.service'
import { FulfillCheckinTask } from 'src/mission-control/domain/tasks/use-cases/fulfill-task/fulfil-checkin-task'

import { MissionControlDatabaseModule } from '../database/database.module'

import { AddHTTPContextToUserInterceptor } from './context/interceptors/add-http-context-to-user.interceptor'
import { TasksController } from './controllers/tasks.controller'
import { TeamScoreController } from './controllers/team-score.controller'

@Module({
  imports: [MissionControlDatabaseModule, UserModule, CoreModule],
  controllers: [TasksController, TeamScoreController],
  providers: [
    TasksService,
    TaskFulfillerService,
    FulfillCheckinTask,
    TeamScoreProcessorService,
    AddHTTPContextToUserInterceptor,
  ],
})
export class HttpModule {}
