import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import GraphQLAuthzModule from 'src/app/graphql/authz'
import GraphQLKeyResultCheckInModule from 'src/app/graphql/key-result/check-in'
import appConfig from 'src/config/app'
import DomainModule from 'src/domain/module'

import GraphQLKeyResultCustomListModule from './custom-list'
import GraphQLKeyResultResolver from './resolver'

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    DomainModule,
    GraphQLAuthzModule,
    GraphQLKeyResultCustomListModule,
    GraphQLKeyResultCheckInModule,
  ],
  providers: [GraphQLKeyResultResolver],
  exports: [GraphQLKeyResultCustomListModule, GraphQLKeyResultCheckInModule],
})
class GraphQLKeyResultsModule {}

export default GraphQLKeyResultsModule
