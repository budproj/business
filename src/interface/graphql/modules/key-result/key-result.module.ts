import { Module } from '@nestjs/common'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'

import { KeyResultCheckInGraphQLResolver } from './modules/check-in/resolvers/key-result-check-in.resolver'
import { KeyResultCheckInsConnectionGraphQLResolver } from './modules/check-in/resolvers/key-result-check-ins-connection.resolver'
import { KeyResultCommentGraphQLResolver } from './modules/comment/resolvers/key-result-comment.resolver'
import { KeyResultGraphQLResolver } from './resolvers/key-result.resolver'

@Module({
  imports: [CoreModule, GraphQLConfigModule],
  providers: [
    KeyResultGraphQLResolver,
    KeyResultCommentGraphQLResolver,
    KeyResultCheckInGraphQLResolver,
    KeyResultCheckInsConnectionGraphQLResolver,
  ],
})
export class KeyResultGraphQLModule {}
