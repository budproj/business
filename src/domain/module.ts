import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import databaseConfig from 'config/database/config'

import DomainCompanyModule from './company'
import DomainCycleModule from './cycle'
import DomainKeyResultModule from './key-result'
import DomainObjectiveModule from './objective'
import DomainTeamModule from './team'
import DomainUserModule from './user'

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    DomainKeyResultModule,
    DomainUserModule,
    DomainObjectiveModule,
    DomainTeamModule,
    DomainCompanyModule,
    DomainCycleModule,
  ],
  exports: [
    DomainKeyResultModule,
    DomainUserModule,
    DomainObjectiveModule,
    DomainTeamModule,
    DomainCompanyModule,
    DomainCycleModule,
  ],
})
class DomainModule {}

export default DomainModule
