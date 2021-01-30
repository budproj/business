import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import AuthzModule from 'src/app/authz'
import appConfig from 'src/config/app'

import { GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard } from './guards'

@Module({
  imports: [ConfigModule.forFeature(appConfig), AuthzModule],
  providers: [GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard],
  exports: [AuthzModule, GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard],
})
class GraphQLAuthzModule {}

export default GraphQLAuthzModule
