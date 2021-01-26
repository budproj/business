import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import databaseConfig from 'src/config/database/config'

import DomainCycleModule from './cycle'
import DomainObjectiveModule from './objective'
import DomainService from './service'
import DomainTeamModule from './team'
import DomainUserModule from './user'

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    DomainUserModule,
    DomainTeamModule,
    DomainCycleModule,
    DomainObjectiveModule,
  ],
  providers: [DomainService],
  exports: [DomainService],
})
class DomainModule {}

export default DomainModule
