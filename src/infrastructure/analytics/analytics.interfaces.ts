import { ProgressRecord } from '@adapters/analytics/progress-record.interface'
import { NestJSGRPCService } from '@lib/grpc/grpc.interfaces'

import { AnalyticsDateWindow } from './analytics.enums'

export interface KeyResultGRPCService {
  getProgressHistory: (options: {
    keyResultId: string
    window?: AnalyticsDateWindow
    startDate?: string
  }) => NestJSGRPCService<AnalyticsGRPCResponse<ProgressRecord[]>>
}

interface AnalyticsGRPCResponse<T> {
  data: T
}
