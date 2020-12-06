import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainConfidenceReportRepository from './repository'
import DomainConfidenceReportService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([DomainConfidenceReportRepository])],
  providers: [DomainConfidenceReportService],
  exports: [DomainConfidenceReportService],
})
class DomainConfidenceReportModule {}

export default DomainConfidenceReportModule
