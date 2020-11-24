import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import databaseConfig from 'config/database/config'

import ConfidenceReportModule from './confidence-report'
import KeyResultModule from './key-result'
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
  ],
  exports: [
    KeyResultModule,
    UserModule,
    ObjectiveModule,
    TeamModule,
    ProgressReportModule,
    ConfidenceReportModule,
  ],
})
class DomainModule {}

export default DomainModule
