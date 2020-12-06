import { forwardRef, Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

import DomainKeyResultModule from 'domain/key-result/module'

import DomainProgressReportRepository from './repository'
import DomainProgressReportService from './service'

@Module({
  imports: [
    TypeOrmModule.forFeature([DomainProgressReportRepository]),
    forwardRef(() => DomainKeyResultModule),
  ],
  providers: [DomainProgressReportService],
  exports: [DomainProgressReportService],
})
class ProgressReportModule {}

export default ProgressReportModule
