import { Module } from '@nestjs/common'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'

import { KeyResultCheckInGraphQLResolver } from './check-in/resolvers/key-result-check-in.resolver'
import { KeyResultCheckInsConnectionGraphQLResolver } from './check-in/resolvers/key-result-check-ins-connection.resolver'
import { KeyResultCommentGraphQLResolver } from './comment/resolvers/key-result-comment.resolver'
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
