import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { Railway } from 'app/providers'
import appConfig from 'config/app'
import DomainModule from 'domain/module'

import GraphQLConfidenceReportModule from './confidence'
import GraphQLProgressReportModule from './progress'
import GraphQLKeyResultReportResolver from './resolver'
import GraphQLKeyResultReportService from './service'

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    DomainModule,
    GraphQLConfidenceReportModule,
    GraphQLProgressReportModule,
  ],
  providers: [GraphQLKeyResultReportResolver, GraphQLKeyResultReportService, Railway],
})
class GraphQLKeyResultReportModule {}

export default GraphQLKeyResultReportModule
