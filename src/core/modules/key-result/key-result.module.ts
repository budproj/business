import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { TeamModule } from '@core/modules/team/team.module'

import { KeyResultCheckInProvider } from './check-in/key-result-check-in.provider'
import { KeyResultCheckInRepository } from './check-in/key-result-check-in.repository'
import { KeyResultCheckMarkProvider } from './check-mark/key-result-check-mark.provider'
import { KeyResultCheckMarkRepository } from './check-mark/key-result-check-mark.repository'
import { KeyResultCommentProvider } from './comment/key-result-comment.provider'
import { KeyResultCommentRepository } from './comment/key-result-comment.repository'
import { KeyResultProvider } from './key-result.provider'
import { KeyResultRepository } from './key-result.repository'
import { KeyResultTimelineProvider } from './timeline.provider'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KeyResultRepository,
      KeyResultCommentRepository,
      KeyResultCheckInRepository,
      KeyResultCheckMarkRepository,
    ]),
    TeamModule,
  ],
  providers: [
    KeyResultProvider,
    KeyResultCommentProvider,
    KeyResultCheckInProvider,
    KeyResultTimelineProvider,
    KeyResultCheckMarkProvider,
  ],
  exports: [KeyResultProvider],
})
export class KeyResultModule {}
