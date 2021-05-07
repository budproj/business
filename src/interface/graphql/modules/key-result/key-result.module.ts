import { Module } from '@nestjs/common'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'
import { AmplitudeModule } from '@infrastructure/amplitude/amplitude.module'
import { KeyResultAccessControl } from '@interface/graphql/modules/key-result/key-result.access-control'

import { KeyResultCheckInsConnectionGraphQLResolver } from './check-in/connections/key-result-check-ins/key-result-check-ins.resolver'
import { KeyResultCheckInAccessControl } from './check-in/key-result-check-in.access-control'
import { KeyResultCheckInGraphQLResolver } from './check-in/key-result-check-in.resolver'
import { KeyResultCommentsConnectionGraphQLResolver } from './comment/connections/key-result-comments/key-result-comments.resolver'
import { KeyResultCommentAccessControl } from './comment/key-result-comment.access-control'
import { KeyResultCommentGraphQLResolver } from './comment/key-result-comment.resolver'
import { KeyResultKeyResultCheckInsConnectionGraphQLResolver } from './connections/key-result-key-result-check-ins/key-result-key-result-check-ins.resolver'
import { KeyResultKeyResultCommentsConnectionGraphQLResolver } from './connections/key-result-key-result-comments/key-result-key-result-comments.resolver'
import { KeyResultTimelineConnectionGraphQLResolver } from './connections/key-result-timeline/key-result-key-result-timeline.resolver'
import { KeyResultsConnectionGraphQLResolver } from './connections/key-results/key-results.resolver'
import { KeyResultGraphQLResolver } from './key-result.resolver'

@Module({
  imports: [CoreModule, GraphQLConfigModule, AmplitudeModule],
  providers: [
    KeyResultGraphQLResolver,
    KeyResultCommentGraphQLResolver,
    KeyResultCheckInGraphQLResolver,
    KeyResultCheckInsConnectionGraphQLResolver,
    KeyResultCheckInAccessControl,
    KeyResultCommentAccessControl,
    KeyResultsConnectionGraphQLResolver,
    KeyResultCommentsConnectionGraphQLResolver,
    KeyResultKeyResultCommentsConnectionGraphQLResolver,
    KeyResultKeyResultCheckInsConnectionGraphQLResolver,
    KeyResultTimelineConnectionGraphQLResolver,
    KeyResultAccessControl,
  ],
})
export class KeyResultGraphQLModule {}
