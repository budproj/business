export type Event<T = unknown> = {
  userId: string
  companyId: string
  date: number
  payload: T
}
