import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import databaseConfig from 'src/config/database/config'

import DomainCycleModule from './cycle'
import DomainKeyResultModule from './key-result'
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
    DomainKeyResultModule,
  ],
  providers: [DomainService],
  exports: [DomainService],
})
class DomainModule {}

export default DomainModule
