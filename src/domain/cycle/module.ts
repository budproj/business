import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainTeamModule from 'src/domain/team'

import DomainCycleRepository from './repository'
import DomainCycleService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([DomainCycleRepository]), DomainTeamModule],
  providers: [DomainCycleService],
  exports: [DomainCycleService],
})
class DomainCycleModule {}

export default DomainCycleModule
