import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import { Railway } from 'src/app/providers'
import appConfig from 'src/config/app'
import DomainModule from 'src/domain/module'

import GraphQLKeyResultCustomListResolver from './resolver'
import GraphQLKeyResultCustomListService from './service'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule],
  providers: [GraphQLKeyResultCustomListResolver, GraphQLKeyResultCustomListService, Railway],
})
class GraphQLKeyResultCustomListsModule {}

export default GraphQLKeyResultCustomListsModule
