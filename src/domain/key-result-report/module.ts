import { Module } from '@nestjs/common'

import ConfidenceReportModule from './confidence'
import ProgressReportModule from './progress'
import KeyResultReportService from './service'

@Module({
  imports: [ProgressReportModule, ConfidenceReportModule],
  providers: [KeyResultReportService],
  exports: [KeyResultReportService],
})
class KeyResultViewModule {}

export default KeyResultViewModule
