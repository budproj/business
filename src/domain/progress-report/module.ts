import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import ProgressReportRepository from './repository'
import ProgressReportService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([ProgressReportRepository])],
  providers: [ProgressReportService],
  exports: [ProgressReportService],
})
class ProgressReportModule {}

export default ProgressReportModule
