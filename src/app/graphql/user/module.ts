import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import appConfig from 'src/config/app'
import DomainModule from 'src/domain/module'

import GraphQLUserResolver from './resolver'
import GraphQLUserService from './service'
import GraphQLUserViewModule from './view'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule, GraphQLUserViewModule],
  providers: [GraphQLUserResolver, GraphQLUserService],
  exports: [GraphQLUserViewModule],
})
class GraphQLUsersModule {}

export default GraphQLUsersModule
