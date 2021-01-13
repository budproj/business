import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { Railway } from 'src/app/providers'
import appConfig from 'src/config/app'
import DomainModule from 'src/domain/module'

import GraphQLKeyResultViewResolver from './resolver'
import GraphQLKeyResultViewService from './service'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule],
  providers: [GraphQLKeyResultViewResolver, GraphQLKeyResultViewService, Railway],
})
class GraphQLKeyResultViewsModule {}

export default GraphQLKeyResultViewsModule
