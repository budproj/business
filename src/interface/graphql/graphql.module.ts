import { Module } from '@nestjs/common'
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'

import { PermissionsGraphQLResolver } from './authorization/resolvers/permissions.resolver'
import { CycleGraphQLModule } from './modules/cycle/cycle.module'
import { KeyResultGraphQLModule } from './modules/key-result/key-result.module'
import { ObjectiveGraphQLModule } from './modules/objective/objective.module'
import { TeamGraphQLModule } from './modules/team/team.module'
import { UserGraphQLModule } from './modules/user/user.module'
import { GraphQLOptionsFactory } from './options.factory'
import { UploadGraphQLScalar } from './scalars/upload.scalar'

@Module({
  imports: [
    NestGraphQLModule.forRootAsync({
      imports: [GraphQLConfigModule],
      useClass: GraphQLOptionsFactory,
    }),
    CoreModule,
    GraphQLConfigModule,
    UserGraphQLModule,
    TeamGraphQLModule,
    CycleGraphQLModule,
    ObjectiveGraphQLModule,
    KeyResultGraphQLModule,
  ],
  providers: [UploadGraphQLScalar, PermissionsGraphQLResolver],
})
export class GraphQLModule {}
