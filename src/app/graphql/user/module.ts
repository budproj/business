import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import appConfig from 'config/app'
import DomainModule from 'domain/module'

import GraphQLUserResolver from './resolver'
import GraphQLUserViewModule from './view'

@Module({
  imports: [ConfigModule.forFeature(appConfig), DomainModule, GraphQLUserViewModule],
  providers: [GraphQLUserResolver],
})
class UsersModule {}

export default UsersModule
