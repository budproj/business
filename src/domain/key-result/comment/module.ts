import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainKeyResultModule from 'src/domain/key-result/module'

import DomainKeyResultCommentRepository from './repository'
import DomainKeyResultCommentService from './service'

@Module({
  imports: [
    TypeOrmModule.forFeature([DomainKeyResultCommentRepository]),
    forwardRef(() => DomainKeyResultModule),
  ],
  providers: [DomainKeyResultCommentService],
  exports: [DomainKeyResultCommentService],
})
class DomainKeyResultCommentModule {}

export default DomainKeyResultCommentModule
