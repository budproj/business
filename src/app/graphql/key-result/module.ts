import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'

import GraphQLAuthzModule from 'src/app/graphql/authz'
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
  ],
  providers: [GraphQLKeyResultResolver],
  exports: [GraphQLKeyResultCustomListModule],
})
class GraphQLKeyResultsModule {}

export default GraphQLKeyResultsModule
