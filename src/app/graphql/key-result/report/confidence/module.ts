import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import appConfig from 'config/app'
import DomainModule from 'domain/module'

import GraphQLConfidenceReportResolver from './resolver'
import GraphQLConfidenceReportService from './service'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule],
  providers: [GraphQLConfidenceReportResolver, GraphQLConfidenceReportService],
})
class GraphQLConfidenceReportsModule {}

export default GraphQLConfidenceReportsModule
