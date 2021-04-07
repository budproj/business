import { Module } from '@nestjs/common'
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'

import { GraphQLOptionsFactory } from './options.factory'
import { PermissionsGraphQLResolver } from './resolvers/permissions.resolver'
import { UserGraphQLResolver } from './resolvers/user.resolver'

@Module({
  imports: [
    NestGraphQLModule.forRootAsync({
      imports: [GraphQLConfigModule],
      useClass: GraphQLOptionsFactory,
    }),
    CoreModule,
  ],
  providers: [UserGraphQLResolver, PermissionsGraphQLResolver],
})
export class GraphQLModule {}
