import { Event } from './events'

export type CommentOnLowConfidenceKREvent = Event<{
  teamId: string
  keyResultId: string
}>
