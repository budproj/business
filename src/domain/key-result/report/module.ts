import { Module } from '@nestjs/common'

import DomainConfidenceReportModule from './confidence'
import DomainProgressReportModule from './progress'
import DomainKeyResultReportService from './service'

@Module({
  imports: [DomainProgressReportModule, DomainConfidenceReportModule],
  providers: [DomainKeyResultReportService],
  exports: [DomainKeyResultReportService],
})
class DomainKeyResultViewModule {}

export default DomainKeyResultViewModule
