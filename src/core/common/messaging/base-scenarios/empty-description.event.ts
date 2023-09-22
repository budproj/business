import { Event } from './events'

export type EmptyDescriptionEvent = Event<{
  teamId: string
  keyResultId: string
}>
