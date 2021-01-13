import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import databaseConfig from 'src/config/database/config'

import DomainCycleModule from './cycle'
import DomainKeyResultModule from './key-result'
import DomainKeyResultReportModule from './key-result/report'
import DomainConfidenceReportModule from './key-result/report/confidence'
import DomainProgressReportModule from './key-result/report/progress'
import DomainObjectiveModule from './objective'
import DomainTeamModule from './team'
import DomainUserModule from './user'
import DomainUserViewModule from './user/view'
import DomainKeyResultViewModule from './user/view/key-result'

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    DomainKeyResultModule,
    DomainUserModule,
    DomainObjectiveModule,
    DomainTeamModule,
    DomainCycleModule,
    DomainUserViewModule,
    DomainKeyResultViewModule,
    DomainKeyResultReportModule,
    DomainProgressReportModule,
    DomainConfidenceReportModule,
  ],
  exports: [
    DomainKeyResultModule,
    DomainUserModule,
    DomainObjectiveModule,
    DomainTeamModule,
    DomainCycleModule,
    DomainUserViewModule,
    DomainKeyResultViewModule,
    DomainKeyResultReportModule,
    DomainProgressReportModule,
    DomainConfidenceReportModule,
  ],
})
class DomainModule {}

export default DomainModule
