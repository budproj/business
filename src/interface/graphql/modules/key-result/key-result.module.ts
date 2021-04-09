import { Module } from '@nestjs/common'

import { CoreModule } from '@core/core.module'

import { KeyResultCommentGraphQLResolver } from './modules/comment/resolvers/key-result-comment.resolver'
import { KeyResultGraphQLResolver } from './resolvers/key-result.resolver'

@Module({
  imports: [CoreModule],
  providers: [KeyResultGraphQLResolver, KeyResultCommentGraphQLResolver],
})
export class KeyResultGraphQLModule {}
