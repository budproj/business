import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import appConfig from 'src/config/app'
import DomainModule from 'src/domain/module'

import GraphQLTeamResolver from './resolver'
import GraphQLTeamService from './service'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule],
  providers: [GraphQLTeamResolver, GraphQLTeamService],
})
class GraphQLTeamModule {}

export default GraphQLTeamModule
