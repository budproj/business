import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import appConfig from 'config/app'
import DomainModule from 'domain/module'

import GraphQLObjectiveResolver from './resolver'
import GraphQLObjectiveService from './service'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule],
  providers: [GraphQLObjectiveResolver, GraphQLObjectiveService],
})
class GraphQLObjectivesModule {}

export default GraphQLObjectivesModule
