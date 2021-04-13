import { Module } from '@nestjs/common'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'

import { KeyResultCheckInsConnectionGraphQLResolver } from './check-in/connections/key-result-check-ins/key-result-check-ins-connection.resolver'
import { KeyResultCheckInGraphQLResolver } from './check-in/key-result-check-in.resolver'
import { KeyResultCommentGraphQLResolver } from './comment/key-result-comment.resolver'
import { KeyResultGraphQLResolver } from './key-result.resolver'

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
