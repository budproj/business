import { forwardRef, Module } from '@nestjs/common'

import DomainConfidenceReportModule from './confidence'
import DomainProgressReportModule from './progress'
import DomainKeyResultReportService from './service'

@Module({
  imports: [
    forwardRef(() => DomainProgressReportModule),
    forwardRef(() => DomainConfidenceReportModule),
  ],
  providers: [DomainKeyResultReportService],
  exports: [DomainKeyResultReportService],
})
class DomainKeyResultReportModule {}

export default DomainKeyResultReportModule