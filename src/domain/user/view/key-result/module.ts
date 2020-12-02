import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainKeyResultViewRepository from './repository'
import DomainKeyResultViewService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([DomainKeyResultViewRepository])],
  providers: [DomainKeyResultViewService],
  exports: [DomainKeyResultViewService],
})
class DomainKeyResultViewModule {}

export default DomainKeyResultViewModule
