import { Module } from '@nestjs/common'

import TasksService from 'src/mission-control/domain/tasks/services/tasks.service'
import TeamScoreProcessorService from 'src/mission-control/domain/tasks/services/team-score-processor.service'

import { MissionControlDatabaseModule } from '../database/database.module'

import { TasksController } from './controllers/tasks.controller'
import { TeamScoreController } from './controllers/team-score.controller'

@Module({
  imports: [MissionControlDatabaseModule],
  controllers: [TasksController, TeamScoreController],
  providers: [TasksService, TeamScoreProcessorService],
})
export class HttpModule {}
