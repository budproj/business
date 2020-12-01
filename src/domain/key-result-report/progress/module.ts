import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import UserModule from 'domain/user'

import ProgressReportRepository from './repository'
import ProgressReportService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([ProgressReportRepository]), UserModule],
  providers: [ProgressReportService],
  exports: [ProgressReportService],
})
class ProgressReportModule {}

export default ProgressReportModule
