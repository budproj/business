import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import GraphQLAuthzModule from 'src/app/graphql/authz'
import appConfig from 'src/config/app'
import DomainModule from 'src/domain/module'

import GraphQLKeyResultCheckInModule from './check-in'
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
