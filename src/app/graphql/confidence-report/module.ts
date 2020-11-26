import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import appConfig from 'config/app'
import DomainModule from 'domain/module'

import ConfidenceReportResolver from './resolver'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule],
  providers: [ConfidenceReportResolver],
})
class ConfidenceReportsModule {}

export default ConfidenceReportsModule
