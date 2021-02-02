import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainKeyResultCommentRepository from './repository'
import DomainKeyResultCommentService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([DomainKeyResultCommentRepository])],
  providers: [DomainKeyResultCommentService],
  exports: [DomainKeyResultCommentService],
})
class DomainKeyResultCommentModule {}

export default DomainKeyResultCommentModule
