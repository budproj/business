import { Module } from '@nestjs/common'
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql'

import GraphQLAuthzModule from './authz'
import GraphQLCycleModule from './cycle'
import graphQLFactory from './factory'
import GraphQLObjectiveModule from './objective'
import GraphQLTeamModule from './team'
import GraphQLUserModule from './user'

@Module({
  imports: [
    NestGraphQLModule.forRootAsync(graphQLFactory),
    GraphQLAuthzModule,
    GraphQLUserModule,
    GraphQLTeamModule,
    GraphQLCycleModule,
    GraphQLObjectiveModule,
  ],
})
class GraphQLModule {}

export default GraphQLModule
