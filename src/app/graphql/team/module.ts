import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import GraphQLAuthzModule from 'src/app/graphql/authz'
import appConfig from 'src/config/app'
import DomainModule from 'src/domain/module'

import GraphQLTeamResolver from './resolver'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule, GraphQLAuthzModule],
  providers: [GraphQLTeamResolver],
})
class GraphQLTeamModule {}

export default GraphQLTeamModule
