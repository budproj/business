import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import databaseConfig from 'config/database/config'

import CompanyModule from './company'
import ConfidenceReportModule from './confidence-report'
import CycleModule from './cycle'
import KeyResultModule from './key-result'
import KeyResultViewModule from './key-result-view'
import ObjectiveModule from './objective'
import ProgressReportModule from './progress-report'
import TeamModule from './team'
import UserModule from './user'

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    KeyResultModule,
    UserModule,
    ObjectiveModule,
    TeamModule,
    ProgressReportModule,
    ConfidenceReportModule,
    KeyResultViewModule,
    CompanyModule,
    CycleModule,
  ],
  exports: [
    KeyResultModule,
    UserModule,
    ObjectiveModule,
    TeamModule,
    ProgressReportModule,
    ConfidenceReportModule,
    KeyResultViewModule,
    CompanyModule,
    CycleModule,
  ],
})
class DomainModule {}

export default DomainModule
