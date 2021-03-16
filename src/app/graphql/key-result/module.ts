import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import GraphQLAuthzModule from 'src/app/graphql/authz'
import appConfig from 'src/config/app'
import DomainModule from 'src/domain/module'

import GraphQLKeyResultCheckInModule from './check-in'
import GraphQLKeyResultCommentModule from './comment'
import GraphQLKeyResultResolver from './resolver'

@Module({
  imports: [
    ConfigModule.forFeature(appConfig),
    DomainModule,
    GraphQLAuthzModule,
    GraphQLKeyResultCheckInModule,
    GraphQLKeyResultCommentModule,
  ],
  providers: [GraphQLKeyResultResolver],
  exports: [GraphQLKeyResultCheckInModule],
})
class GraphQLKeyResultsModule {}

export default GraphQLKeyResultsModule
