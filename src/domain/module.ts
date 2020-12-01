import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import databaseConfig from 'config/database/config'

import CompanyModule from './company'
import CycleModule from './cycle'
import KeyResultModule from './key-result'
import KeyResultReportModule from './key-result-report'
import KeyResultViewModule from './key-result-view'
import ObjectiveModule from './objective'
import TeamModule from './team'
import UserModule from './user'

@Module({
  imports: [
    TypeOrmModule.forRoot(databaseConfig),
    KeyResultModule,
    UserModule,
    ObjectiveModule,
    TeamModule,
    KeyResultViewModule,
    KeyResultReportModule,
    CompanyModule,
    CycleModule,
  ],
  exports: [
    KeyResultModule,
    UserModule,
    ObjectiveModule,
    TeamModule,
    KeyResultViewModule,
    KeyResultReportModule,
    CompanyModule,
    CycleModule,
  ],
})
class DomainModule {}

export default DomainModule
