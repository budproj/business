import { Module } from '@nestjs/common'

import { Railway } from 'app/providers'
import DomainModule from 'domain/module'

import ProgressReportResolver from './resolver'

@Module({
  imports: [DomainModule],
  providers: [ProgressReportResolver, Railway],
})
class ProgressReportsModule {}

export default ProgressReportsModule
