import { KeyResultCheckInGraphQLNode } from '../../check-in/key-result-check-in.node'
import { KeyResultCommentGraphQLNode } from '../../comment/key-result-comment.node'

export type KeyResultTimelineEntry = KeyResultCheckInGraphQLNode | KeyResultCommentGraphQLNode
