import { createUnionType } from '@nestjs/graphql'

import { KeyResultCheckInGraphQLNode } from '../../check-in/key-result-check-in.node'
import { KeyResultCommentGraphQLNode } from '../../comment/key-result-comment.node'
import { KeyResultUpdateGraphQLNode } from '../../update/key-result-update.node'

export const KeyResultTimelineEntryGraphQLUnion = createUnionType({
  name: 'KeyResultTimelineEntryUnion',
  types: () => [
    KeyResultCheckInGraphQLNode,
    KeyResultCommentGraphQLNode,
    KeyResultUpdateGraphQLNode,
  ],
  resolveType(value) {
    if ('value' in value) {
      return KeyResultCheckInGraphQLNode
    }

    if ('text' in value) {
      return KeyResultCommentGraphQLNode
    }

    if ('patches' in value) {
      return KeyResultUpdateGraphQLNode
    }
  },
})
