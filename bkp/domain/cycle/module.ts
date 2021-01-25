import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainTeamModule from 'src/domain/team'
import databaseConfig from 'src/config/database/config'

import DomainCycleRepository from './repository'
import DomainCycleService from './service'

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    TypeOrmModule.forFeature([DomainCycleRepository]),
    DomainTeamModule,
  ],
  providers: [DomainCycleService],
  exports: [DomainCycleService],
})
class DomainCycleModule {}

export default DomainCycleModule
