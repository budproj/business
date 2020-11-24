import { Module } from '@nestjs/common'

import DomainModule from 'domain/module'

import ConfidenceReportResolver from './resolver'

@Module({
  imports: [DomainModule],
  providers: [ConfidenceReportResolver],
})
class ConfidenceReportsModule {}

export default ConfidenceReportsModule
