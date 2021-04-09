import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { KeyResultProvider } from './key-result.provider'
import { KeyResultRepository } from './key-result.repository'
import { KeyResultCheckInProvider } from './modules/check-in/key-result-check-in.provider'
import { KeyResultCheckInRepository } from './modules/check-in/key-result-check-in.repository'
import { KeyResultCommentProvider } from './modules/comment/key-result-comment.provider'
import { KeyResultCommentRepository } from './modules/comment/key-result-comment.repository'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      KeyResultRepository,
      KeyResultCommentRepository,
      KeyResultCheckInRepository,
    ]),
  ],
  providers: [KeyResultProvider, KeyResultCommentProvider, KeyResultCheckInProvider],
  exports: [KeyResultProvider],
})
export class KeyResultModule {}
