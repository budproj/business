import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainCycleRepository from './repository'
import DomainCycleService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([DomainCycleRepository])],
  providers: [DomainCycleService],
  exports: [DomainCycleService],
})
class DomainCycleModule {}

export default DomainCycleModule
