import { KeyResultCheckIn } from '../check-in/key-result-check-in.orm-entity'
import { KeyResultComment } from '../comment/key-result-comment.orm-entity'

export type KeyResultTimelineEntry = KeyResultCheckIn | KeyResultComment
