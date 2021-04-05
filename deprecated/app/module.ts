import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import appConfig from 'src/config/app'

import AuthzModule from './authz'
import GraphQLModule from './graphql'

@Module({
  imports: [ConfigModule.forFeature(appConfig), AuthzModule, GraphQLModule],
})
class AppModule {}

export default AppModule
