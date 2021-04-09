import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { KeyResultCheckInProvider } from './check-in/key-result-check-in.provider'
import { KeyResultCheckInRepository } from './check-in/key-result-check-in.repository'
import { KeyResultCommentProvider } from './comment/key-result-comment.provider'
import { KeyResultCommentRepository } from './comment/key-result-comment.repository'
import { KeyResultProvider } from './key-result.provider'
import { KeyResultRepository } from './key-result.repository'

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
