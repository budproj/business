import { createUnionType } from '@nestjs/graphql'

import { KeyResultCheckInGraphQLNode } from '../../check-in/key-result-check-in.node'
import { KeyResultCommentGraphQLNode } from '../../comment/key-result-comment.node'

export const KeyResultTimelineEntryGraphQLUnion = createUnionType({
  name: 'KeyResultTimelineEntryUnion',
  types: () => [KeyResultCheckInGraphQLNode, KeyResultCommentGraphQLNode],
  resolveType(value) {
    if ('value' in value) {
      return KeyResultCheckInGraphQLNode
    }

    if ('text' in value) {
      return KeyResultCommentGraphQLNode
    }
  },
})
