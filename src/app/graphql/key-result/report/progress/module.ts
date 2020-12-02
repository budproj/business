import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { Railway } from 'app/providers'
import appConfig from 'config/app'
import DomainModule from 'domain/module'

import GraphQLProgressReportResolver from './resolver'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule],
  providers: [GraphQLProgressReportResolver, Railway],
})
class GraphQLProgressReportsModule {}

export default GraphQLProgressReportsModule
