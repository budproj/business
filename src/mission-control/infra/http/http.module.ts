import { Module } from '@nestjs/common'

import { TaskFulfillerService } from 'src/mission-control/domain/tasks/services/fulfiller-task.service'
import TasksService from 'src/mission-control/domain/tasks/services/tasks.service'
import TeamScoreProcessorService from 'src/mission-control/domain/tasks/services/team-score-processor.service'
import { FulfillCheckinTask } from 'src/mission-control/domain/tasks/use-cases/fulfill-task/fulfil-checkin-task'

import { MissionControlDatabaseModule } from '../database/database.module'

import { TasksController } from './controllers/tasks.controller'
import { TeamScoreController } from './controllers/team-score.controller'

@Module({
  imports: [MissionControlDatabaseModule],
  controllers: [TasksController, TeamScoreController],
  providers: [TasksService, TaskFulfillerService, FulfillCheckinTask, TeamScoreProcessorService],
})
export class HttpModule {}
