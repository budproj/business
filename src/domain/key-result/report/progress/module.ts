import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainUserModule from 'domain/user'

import DomainProgressReportRepository from './repository'
import DomainProgressReportService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([DomainProgressReportRepository]), DomainUserModule],
  providers: [DomainProgressReportService],
  exports: [DomainProgressReportService],
})
class ProgressReportModule {}

export default ProgressReportModule
