import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainTeamModule from 'src/domain/team'

import DomainConfidenceReportRepository from './repository'
import DomainConfidenceReportService from './service'

@Module({
  imports: [
    TypeOrmModule.forFeature([DomainConfidenceReportRepository]),
    forwardRef(() => DomainTeamModule),
  ],
  providers: [DomainConfidenceReportService],
  exports: [DomainConfidenceReportService],
})
class DomainConfidenceReportModule {}

export default DomainConfidenceReportModule
