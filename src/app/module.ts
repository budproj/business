import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import AuthzModule from 'app/authz'
import appConfig from 'config/app'

import GraphQLModule from './graphql'

@Module({
  imports: [ConfigModule.forFeature(appConfig), AuthzModule, GraphQLModule],
})
class AppModule {}

export default AppModule
