import { Module } from '@nestjs/common'
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql'

import GraphQLCompanyModule from './company'
import GraphQLCycleModule from './cycle'
import graphQLFactory from './factory'
import GraphQLKeyResultModule from './key-result'
import GraphQLObjectiveModule from './objective'
import GraphQLTeamModule from './team'
import GraphQLUserModule from './user'

@Module({
  imports: [
    NestGraphQLModule.forRootAsync(graphQLFactory),
    GraphQLKeyResultModule,
    GraphQLUserModule,
    GraphQLObjectiveModule,
    GraphQLTeamModule,
    GraphQLCompanyModule,
    GraphQLCycleModule,
  ],
})
class GraphQLModule {}

export default GraphQLModule
