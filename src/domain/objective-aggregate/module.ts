import { Module } from '@nestjs/common'

import ConfidenceReportModule from './confidence-report'
import KeyResultModule from './key-result'
import ObjectiveModule from './objective'
import ProgressReportModule from './progress-report'
import ObjectiveAggregateService from './service'

@Module({
  imports: [ObjectiveModule, KeyResultModule, ProgressReportModule, ConfidenceReportModule],
  providers: [ObjectiveAggregateService],
  exports: [ObjectiveAggregateService],
})
class ObjectiveAggregateModule {}

export default ObjectiveAggregateModule
