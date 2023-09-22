import { Module } from '@nestjs/common'

import TasksService from 'src/mission-control/domain/tasks/services/tasks.service'
import TeamScoreProcessorService from 'src/mission-control/domain/tasks/services/team-score-processor.service'
import { FulfillCheckinTask } from 'src/mission-control/domain/tasks/use-cases/fulfill-task/fulfil-checkin-task'
import { FulfillCommenBarrierKeyResultTask } from 'src/mission-control/domain/tasks/use-cases/fulfill-task/fullfil-comment-on-barrier-key-result-task'
import { FulfillCommentOnKeyResultTask } from 'src/mission-control/domain/tasks/use-cases/fulfill-task/fullfil-comment-on-key-result-task'
import { FulfillCommentOnLowConfidenceKeyResultTask } from 'src/mission-control/domain/tasks/use-cases/fulfill-task/fullfil-comment-on-low-confidence-key-result-task'
import { FulfillEmptyDescriptionTask } from 'src/mission-control/domain/tasks/use-cases/fulfill-task/fullfil-empty-description-task'

import { MissionControlDatabaseModule } from '../database/database.module'

import { TasksController } from './controllers/tasks.controller'
import { TeamScoreController } from './controllers/team-score.controller'

@Module({
  imports: [MissionControlDatabaseModule],
  controllers: [TasksController, TeamScoreController],
  providers: [
    TasksService,
    TeamScoreProcessorService,
    FulfillCheckinTask,
    FulfillEmptyDescriptionTask,
    FulfillCommentOnKeyResultTask,
    FulfillCommenBarrierKeyResultTask,
    FulfillCommentOnLowConfidenceKeyResultTask,
  ],
})
export class HttpModule {}
