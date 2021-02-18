import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import GraphQLAuthzModule from 'src/app/graphql/authz'
import appConfig from 'src/config/app'
import DomainModule from 'src/domain/module'
import RailwayProvider from 'src/railway'

import GraphQLCycleResolver from './resolver'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule, GraphQLAuthzModule],
  providers: [GraphQLCycleResolver, RailwayProvider],
})
class GraphQLCyclesModule {}

export default GraphQLCyclesModule
