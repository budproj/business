import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import appConfig from 'config/app'
import DomainModule from 'domain/module'

import GraphQLConfidenceReportResolver from './resolver'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule],
  providers: [GraphQLConfidenceReportResolver],
})
class GraphQLConfidenceReportsModule {}

export default GraphQLConfidenceReportsModule
