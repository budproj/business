import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import GraphQLAuthzModule from 'src/app/graphql/authz'
import appConfig from 'src/config/app'
import DomainModule from 'src/domain/module'
import RailwayProvider from 'src/railway'

import GraphQLCheckInResolver from './resolver'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule, GraphQLAuthzModule],
  providers: [GraphQLCheckInResolver, RailwayProvider],
})
class GraphQLCheckInsModule {}

export default GraphQLCheckInsModule
