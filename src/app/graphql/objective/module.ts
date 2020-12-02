import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import appConfig from 'config/app'
import DomainModule from 'domain/module'

import GraphQLObjectiveResolver from './resolver'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule],
  providers: [GraphQLObjectiveResolver],
})
class GraphQLObjectivesModule {}

export default GraphQLObjectivesModule
