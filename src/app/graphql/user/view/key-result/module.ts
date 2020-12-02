import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { Railway } from 'app/providers'
import appConfig from 'config/app'
import DomainModule from 'domain/module'

import GraphQLKeyResultViewResolver from './resolver'
import GraphQLKeyResultViewService from './service'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule],
  providers: [GraphQLKeyResultViewResolver, GraphQLKeyResultViewService, Railway],
})
class GraphQLKeyResultViewsModule {}

export default GraphQLKeyResultViewsModule
