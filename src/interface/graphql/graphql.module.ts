import { Module } from '@nestjs/common'
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'

import { GraphQLOptionsFactory } from './options.factory'
import { PermissionsGraphQLResolver } from './resolvers/permissions.resolver'
import { TeamGraphQLResolver } from './resolvers/team.resolver'
import { UserGraphQLResolver } from './resolvers/user.resolver'

@Module({
  imports: [
    NestGraphQLModule.forRootAsync({
      imports: [GraphQLConfigModule],
      useClass: GraphQLOptionsFactory,
    }),
    CoreModule,
  ],
  providers: [PermissionsGraphQLResolver, TeamGraphQLResolver, UserGraphQLResolver],
})
export class GraphQLModule {}
