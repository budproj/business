import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import appConfig from 'src/config/app'
import DomainModule from 'src/domain/module'

import GraphQLTeamResolver from './resolver'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule],
  providers: [GraphQLTeamResolver],
})
class GraphQLTeamModule {}

export default GraphQLTeamModule
