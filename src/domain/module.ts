import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import databaseConfig from 'src/config/database/config'
import DomainCycleModule from 'src/domain/cycle'
import DomainService from 'src/domain/service'

import DomainTeamModule from './team'
import DomainUserModule from './user'

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    DomainUserModule,
    DomainTeamModule,
    DomainCycleModule,
  ],
  providers: [DomainService],
  exports: [DomainService],
})
class DomainModule {}

export default DomainModule
