import { Module } from '@nestjs/common'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'

import { KeyResultCheckInsConnectionGraphQLResolver } from './check-in/connections/key-result-check-ins/key-result-check-ins.resolver'
import { KeyResultCheckInGraphQLResolver } from './check-in/key-result-check-in.resolver'
import { KeyResultCommentsConnectionGraphQLResolver } from './comment/connections/key-result-comments/key-result-comments.resolver'
import { KeyResultCommentGraphQLResolver } from './comment/key-result-comment.resolver'
import { KeyResultKeyResultCommentsConnectionGraphQLResolver } from './connections/key-result-key-result-comments/key-result-key-result-comments.resolver'
import { KeyResultsConnectionGraphQLResolver } from './connections/key-results/key-results.resolver'
import { KeyResultGraphQLResolver } from './key-result.resolver'

@Module({
  imports: [CoreModule, GraphQLConfigModule],
  providers: [
    KeyResultGraphQLResolver,
    KeyResultCommentGraphQLResolver,
    KeyResultCheckInGraphQLResolver,
    KeyResultCheckInsConnectionGraphQLResolver,
    KeyResultsConnectionGraphQLResolver,
    KeyResultCommentsConnectionGraphQLResolver,
    KeyResultKeyResultCommentsConnectionGraphQLResolver,
  ],
})
export class KeyResultGraphQLModule {}
