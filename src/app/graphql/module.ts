import { Module } from '@nestjs/common'
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql'

import graphQLFactory from './factory'
import GraphQLUserModule from './user'
import GraphQLTeamModule from './team'
// import GraphQLCycleModule from './cycle'
// import GraphQLKeyResultModule from './key-result'
// import GraphQLObjectiveModule from './objective'

@Module({
  imports: [
    NestGraphQLModule.forRootAsync(graphQLFactory),
    GraphQLUserModule,
    GraphQLTeamModule,
    // GraphQLKeyResultModule,
    // GraphQLObjectiveModule,
    // GraphQLCycleModule,
  ],
})
class GraphQLModule {}

export default GraphQLModule
