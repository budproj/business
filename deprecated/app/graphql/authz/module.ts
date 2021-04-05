import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import AuthzModule from 'src/app/authz'
import { GraphQLPermissionsResolver } from 'src/app/graphql/authz/resolver'
import appConfig from 'src/config/app'
import DomainModule from 'src/domain'

import { GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard } from './guards'

@Module({
  imports: [ConfigModule.forFeature(appConfig), AuthzModule, DomainModule],
  providers: [GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard, GraphQLPermissionsResolver],
  exports: [AuthzModule, GraphQLAuthzAuthGuard, GraphQLAuthzPermissionGuard],
})
class GraphQLAuthzModule {}

export default GraphQLAuthzModule
