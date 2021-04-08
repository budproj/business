import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import { KeyResultCommentProvider } from './comment/key-result-comment.provider'
import { KeyResultCommentRepository } from './comment/key-result-comment.repository'
import { KeyResultProvider } from './key-result.provider'
import { KeyResultRepository } from './key-result.repository'

@Module({
  imports: [TypeOrmModule.forFeature([KeyResultRepository, KeyResultCommentRepository])],
  providers: [KeyResultProvider, KeyResultCommentProvider],
  exports: [KeyResultProvider],
})
export class KeyResultModule {}
