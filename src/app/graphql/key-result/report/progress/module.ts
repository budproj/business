import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { Railway } from 'src/app/providers'
import appConfig from 'src/config/app'
import DomainModule from 'src/domain/module'

import GraphQLProgressReportResolver from './resolver'
import GraphQLProgressReportService from './service'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule],
  providers: [GraphQLProgressReportResolver, GraphQLProgressReportService, Railway],
})
class GraphQLProgressReportsModule {}

export default GraphQLProgressReportsModule
