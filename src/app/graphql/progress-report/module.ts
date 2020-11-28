import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { Railway } from 'app/providers'
import appConfig from 'config/app'
import DomainModule from 'domain/module'

import ProgressReportResolver from './resolver'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule],
  providers: [ProgressReportResolver, Railway],
})
class ProgressReportsModule {}

export default ProgressReportsModule
