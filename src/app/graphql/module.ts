import { Module } from '@nestjs/common'
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql'

import graphQLFactory from './factory'
// import GraphQLCycleModule from './cycle'
// import GraphQLKeyResultModule from './key-result'
// import GraphQLObjectiveModule from './objective'
// import GraphQLTeamModule from './team'
import GraphQLUserModule from './user'

@Module({
  imports: [
    NestGraphQLModule.forRootAsync(graphQLFactory),
    GraphQLUserModule,
    //GraphQLTeamModule,
    // GraphQLKeyResultModule,
    // GraphQLObjectiveModule,
    // GraphQLCycleModule,
  ],
})
class GraphQLModule {}

export default GraphQLModule
