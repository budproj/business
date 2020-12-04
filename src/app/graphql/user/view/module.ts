import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import appConfig from 'config/app'
import DomainModule from 'domain/module'

import GraphQLKeyResultViewModule from './key-result'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule, GraphQLKeyResultViewModule],
  exports: [GraphQLKeyResultViewModule],
})
class GraphQLUserViewModule {}

export default GraphQLUserViewModule
