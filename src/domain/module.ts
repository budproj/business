import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import databaseConfig from 'src/config/database/config'

// import DomainCycleModule from './cycle'
// import DomainKeyResultModule from './key-result'
// import DomainKeyResultReportModule from './key-result/report'
// import DomainConfidenceReportModule from './key-result/report/confidence'
// import DomainProgressReportModule from './key-result/report/progress'
// import DomainObjectiveModule from './objective'
import DomainUserModule from './user'
import DomainTeamModule from './team'
import DomainService from 'src/domain/service'

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    DomainUserModule,
    DomainTeamModule,
    // DomainKeyResultModule,
    // DomainObjectiveModule,
    // DomainCycleModule,
    // DomainKeyResultReportModule,
    // DomainProgressReportModule,
    // DomainConfidenceReportModule,
  ],
  providers: [DomainService],
  exports: [DomainService],
})
class DomainModule {}

export default DomainModule
