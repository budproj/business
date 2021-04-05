import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule } from '@nestjs/graphql'

import { GraphQLAdapterFactory } from './graphql.factory'
import { UserGraphQLResolver } from './resolvers/user.resolver'

@Module({
  imports: [
    GraphQLModule.forRootAsync({
      imports: [ConfigModule],
      useClass: GraphQLAdapterFactory,
    }),
  ],
  providers: [UserGraphQLResolver],
})
export class GraphQLAdapterModule {}
