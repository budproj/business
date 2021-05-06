import { Module } from '@nestjs/common'
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'
import { AmplitudeModule } from '@infrastructure/amplitude/amplitude.module'

import { PermissionsGraphQLResolver } from './adapters/authorization/resolvers/permissions.resolver'
import { UploadGraphQLScalar } from './adapters/upload/scalars/upload.scalar'
import { CycleGraphQLModule } from './modules/cycle/cycle.module'
import { KeyResultGraphQLModule } from './modules/key-result/key-result.module'
import { ObjectiveGraphQLModule } from './modules/objective/objective.module'
import { TeamGraphQLModule } from './modules/team/team.module'
import { UserGraphQLModule } from './modules/user/user.module'
import { GraphQLOptionsFactory } from './options.factory'

@Module({
  imports: [
    NestGraphQLModule.forRootAsync({
      imports: [GraphQLConfigModule],
      useClass: GraphQLOptionsFactory,
    }),
    CoreModule,
    AmplitudeModule,
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
