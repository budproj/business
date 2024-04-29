import { Event } from './events'

export type CheckInEvent = Event<{
  teamId: string
  keyResultId: string
}>
