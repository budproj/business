import { Module } from '@nestjs/common'

import { CoreModule } from '@core/core.module'

import { KeyResultCheckInGraphQLResolver } from './modules/check-in/resolvers/key-result-check-in.resolver'
import { KeyResultCommentGraphQLResolver } from './modules/comment/resolvers/key-result-comment.resolver'
import { KeyResultGraphQLResolver } from './resolvers/key-result.resolver'

@Module({
  imports: [CoreModule],
  providers: [
    KeyResultGraphQLResolver,
    KeyResultCommentGraphQLResolver,
    KeyResultCheckInGraphQLResolver,
  ],
})
export class KeyResultGraphQLModule {}
