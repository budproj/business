import { Logger, Module } from '@nestjs/common'

import DomainModule from 'domain/module'

import ProgressReportsController from './controller'
import ProgressReportsService from './service'

@Module({
  imports: [DomainModule],
  controllers: [ProgressReportsController],
  providers: [Logger, ProgressReportsService],
})
class ProgressReportsModule {}

export default ProgressReportsModule
