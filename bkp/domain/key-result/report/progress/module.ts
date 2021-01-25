import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainKeyResultModule from 'src/domain/key-result/module'
import DomainTeamModule from 'src/domain/team'

import DomainProgressReportRepository from './repository'
import DomainProgressReportService from './service'

@Module({
  imports: [
    TypeOrmModule.forFeature([DomainProgressReportRepository]),
    forwardRef(() => DomainKeyResultModule),
    forwardRef(() => DomainTeamModule),
  ],
  providers: [DomainProgressReportService],
  exports: [DomainProgressReportService],
})
class ProgressReportModule {}

export default ProgressReportModule
