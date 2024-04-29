import { Event } from './events'

export type CommentOnKREvent = Event<{
  teamId: string
  keyResultId: string
}>
