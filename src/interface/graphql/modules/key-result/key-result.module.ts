import { Module } from '@nestjs/common'

import { GraphQLConfigModule } from '@config/graphql/graphql.module'
import { CoreModule } from '@core/core.module'
import { AmplitudeModule } from '@infrastructure/amplitude/amplitude.module'
import { NotificationModule } from '@infrastructure/notification/notification.module'
import { KeyResultCheckInAccessControl } from '@interface/graphql/modules/key-result/access-control/key-result-check-in.access-control'
import { KeyResultCommentAccessControl } from '@interface/graphql/modules/key-result/access-control/key-result-comment.access-control'
import { KeyResultAccessControl } from '@interface/graphql/modules/key-result/access-control/key-result.access-control'

import { KeyResultCheckMarkAccessControl } from './access-control/key-result-check-mark.access-control'
import { KeyResultCheckInsConnectionGraphQLResolver } from './check-in/connections/key-result-check-ins/key-result-check-ins.resolver'
import { KeyResultCheckInGraphQLResolver } from './check-in/key-result-check-in.resolver'
import { KeyResultCheckMarkGraphQLResolver } from './check-mark/key-result-check-mark.resolver'
import { KeyResultCommentsConnectionGraphQLResolver } from './comment/connections/key-result-comments/key-result-comments.resolver'
import { KeyResultCommentGraphQLResolver } from './comment/key-result-comment.resolver'
import { KeyResultKeyResultCheckInsConnectionGraphQLResolver } from './connections/key-result-key-result-check-ins/key-result-key-result-check-ins.resolver'
import { KeyResultKeyResultCheckMarksConnectionGraphQLResolver } from './connections/key-result-key-result-check-mark/key-result-key-result-check-marks.resolver'
import { KeyResultKeyResultCommentsConnectionGraphQLResolver } from './connections/key-result-key-result-comments/key-result-key-result-comments.resolver'
import { KeyResultKeyResultSupportTeamConnectionGraphQLResolver } from './connections/key-result-key-result-support-team/key-result-key-result-support-team.resolver'
import { KeyResultProgressHistoryConnectionGraphQLResolver } from './connections/key-result-progress-history/key-result-progress-history.resolver'
import { KeyResultTimelineConnectionGraphQLResolver } from './connections/key-result-timeline/key-result-key-result-timeline.resolver'
import { KeyResultsConnectionGraphQLResolver } from './connections/key-results/key-results.resolver'
import { KeyResultGraphQLResolver } from './key-result.resolver'
import { KeyResultProgressRecordGraphQLResolver } from './progress-record/key-result-progress-record.resolver'

@Module({
  imports: [CoreModule, GraphQLConfigModule, AmplitudeModule, NotificationModule],
  providers: [
    KeyResultGraphQLResolver,
    KeyResultCommentGraphQLResolver,
    KeyResultCheckMarkGraphQLResolver,
    KeyResultCheckInGraphQLResolver,
    KeyResultCheckInsConnectionGraphQLResolver,
    KeyResultsConnectionGraphQLResolver,
    KeyResultCommentsConnectionGraphQLResolver,
    KeyResultKeyResultCommentsConnectionGraphQLResolver,
    KeyResultKeyResultCheckInsConnectionGraphQLResolver,
    KeyResultTimelineConnectionGraphQLResolver,
    KeyResultKeyResultCheckMarksConnectionGraphQLResolver,
    KeyResultAccessControl,
    KeyResultCheckInAccessControl,
    KeyResultCommentAccessControl,
    KeyResultCheckMarkAccessControl,
    KeyResultProgressRecordGraphQLResolver,
    KeyResultProgressHistoryConnectionGraphQLResolver,
    KeyResultKeyResultSupportTeamConnectionGraphQLResolver,
  ],
  exports: [KeyResultAccessControl],
})
export class KeyResultGraphQLModule {}
