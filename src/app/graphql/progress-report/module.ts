import { Module } from '@nestjs/common'

import DomainModule from 'domain/module'

import ProgressReportResolver from './resolver'

@Module({
  imports: [DomainModule],
  providers: [ProgressReportResolver],
})
class ProgressReportsModule {}

export default ProgressReportsModule
