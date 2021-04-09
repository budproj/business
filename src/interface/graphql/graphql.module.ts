import { Module } from '@nestjs/common'
import { GraphQLModule as NestGraphQLModule } from '@nestjs/graphql'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'

import { GraphQLOptionsFactory } from './options.factory'
import { CycleGraphQLResolver } from './resolvers/cycle/cycle.resolver'
import { KeyResultCommentGraphQLResolver } from './resolvers/key-result/comment/key-result-comment.resolver'
import { KeyResultGraphQLResolver } from './resolvers/key-result/key-result.resolver'
import { ObjectiveGraphQLResolver } from './resolvers/objective/objective.resolver'
import { PermissionsGraphQLResolver } from './resolvers/permissions/permissions.resolver'
import { TeamGraphQLResolver } from './resolvers/team/team.resolver'
import { UserGraphQLResolver } from './resolvers/user/user.resolver'

@Module({
  imports: [
    NestGraphQLModule.forRootAsync({
      imports: [GraphQLConfigModule],
      useClass: GraphQLOptionsFactory,
    }),
    CoreModule,
  ],
  providers: [
    PermissionsGraphQLResolver,
    TeamGraphQLResolver,
    UserGraphQLResolver,
    CycleGraphQLResolver,
    ObjectiveGraphQLResolver,
    KeyResultGraphQLResolver,
    KeyResultCommentGraphQLResolver,
  ],
})
export class GraphQLModule {}
