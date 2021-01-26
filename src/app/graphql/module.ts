import { Module } from '@nestjs/common'
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql'

import GraphQLAuthzModule from './authz'
import graphQLFactory from './factory'
import GraphQLTeamModule from './team'
import GraphQLUserModule from './user'

@Module({
  imports: [
    NestGraphQLModule.forRootAsync(graphQLFactory),
    GraphQLAuthzModule,
    GraphQLUserModule,
    GraphQLTeamModule,
  ],
})
class GraphQLModule {}

export default GraphQLModule
