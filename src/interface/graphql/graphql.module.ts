import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql'

import { createGraphQLConfig } from '@config/graphql/graphql.factory'
import { AuthzModule } from '@infrastructure/authz/authz.module'

import { GraphQLOptionsFactory } from './options.factory'
import { UserGraphQLResolver } from './resolvers/user.resolver'

@Module({
  imports: [
    NestGraphQLModule.forRootAsync({
      imports: [ConfigModule.forFeature(createGraphQLConfig)],
      useClass: GraphQLOptionsFactory,
    }),
    AuthzModule,
  ],
  providers: [UserGraphQLResolver],
})
export class GraphQLModule {}
