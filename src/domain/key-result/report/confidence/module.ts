import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainUserModule from 'domain/user'

import DomainConfidenceReportRepository from './repository'
import DomainConfidenceReportService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([DomainConfidenceReportRepository]), DomainUserModule],
  providers: [DomainConfidenceReportService],
  exports: [DomainConfidenceReportService],
})
class DomainConfidenceReportModule {}

export default DomainConfidenceReportModule
