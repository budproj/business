import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { Railway } from 'app/providers'
import appConfig from 'config/app'
import DomainModule from 'domain/module'

import GraphQLKeyResultReportModule from './report'
import GraphQLKeyResultResolver from './resolver'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule, GraphQLKeyResultReportModule],
  providers: [GraphQLKeyResultResolver, Railway],
})
class GraphQLKeyResultsModule {}

export default GraphQLKeyResultsModule
