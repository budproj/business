import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainUserModule from 'domain/user'

import DomainCycleRepository from './repository'
import DomainCycleService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([DomainCycleRepository]), DomainUserModule],
  providers: [DomainCycleService],
  exports: [DomainCycleService],
})
class DomainCycleModule {}

export default DomainCycleModule
