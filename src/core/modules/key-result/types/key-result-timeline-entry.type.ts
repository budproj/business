import { KeyResultCheckIn } from '../check-in/key-result-check-in.orm-entity'
import { KeyResultComment } from '../comment/key-result-comment.orm-entity'
import { KeyResultUpdate } from '../update/key-result-update.orm-entity'

export type KeyResultTimelineEntry = KeyResultCheckIn | KeyResultComment | KeyResultUpdate
