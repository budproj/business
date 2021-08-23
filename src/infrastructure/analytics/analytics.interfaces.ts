import { AnalyticsDateWindow } from './analytics.enums'

export interface KeyResultGRPCService {
  getProgressHistory: (options: {
    keyResultId: string
    window?: AnalyticsDateWindow
    startDate?: string
  }) => any
}
