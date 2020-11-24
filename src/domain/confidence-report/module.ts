import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import UserModule from 'domain/user'

import ConfidenceReportRepository from './repository'
import ConfidenceReportService from './service'

@Module({
  imports: [TypeOrmModule.forFeature([ConfidenceReportRepository]), UserModule],
  providers: [ConfidenceReportService],
  exports: [ConfidenceReportService],
})
class ConfidenceReportModule {}

export default ConfidenceReportModule
