import { KeyResultCheckInGraphQLNode } from '../../check-in/key-result-check-in.node'
import { KeyResultCommentGraphQLNode } from '../../comment/key-result-comment.node'
import { KeyResultUpdateGraphQLNode } from '../../update/key-result-update.node'

export type KeyResultTimelineEntry =
  | KeyResultCheckInGraphQLNode
  | KeyResultCommentGraphQLNode
  | KeyResultUpdateGraphQLNode
