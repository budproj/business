import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TeamModule } from '@core/modules/team/team.module'
import { AnalyticsModule } from '@infrastructure/analytics/analytics.module'

import { CycleProvider } from '../cycle/cycle.provider'
import { CycleRepository } from '../cycle/cycle.repository'
import { ObjectiveProvider } from '../objective/objective.provider'
import { ObjectiveRepository } from '../objective/objective.repository'

import { KeyResultCheckInProvider } from './check-in/key-result-check-in.provider'
import { KeyResultCheckInRepository } from './check-in/key-result-check-in.repository'
import { KeyResultCheckMarkProvider } from './check-mark/key-result-check-mark.provider'
import { KeyResultCheckMarkRepository } from './check-mark/key-result-check-mark.repository'
import { KeyResultCommentProvider } from './comment/key-result-comment.provider'
import { KeyResultCommentRepository } from './comment/key-result-comment.repository'
import { KeyResultProvider } from './key-result.provider'
import { KeyResultRepository } from './key-result.repository'
import { KeyResultTimelineProvider } from './timeline.provider'
import { KeyResultUpdateProvider } from './update/key-result-update.provider'
import { KeyResultUpdateRepository } from './update/key-result-update.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KeyResultRepository,
      KeyResultCommentRepository,
      KeyResultCheckInRepository,
      KeyResultUpdateRepository,
      KeyResultCheckMarkRepository,
      CycleRepository,
      ObjectiveRepository,
    ]),
    TeamModule,
    AnalyticsModule,
  ],
  providers: [
    KeyResultProvider,
    KeyResultCommentProvider,
    KeyResultCheckInProvider,
    KeyResultUpdateProvider,
    KeyResultTimelineProvider,
    KeyResultCheckMarkProvider,
    CycleProvider,
    ObjectiveProvider,
  ],
  exports: [KeyResultProvider],
})
export class KeyResultModule {}
