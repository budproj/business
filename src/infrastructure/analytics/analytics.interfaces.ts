import { KeyResultData } from '@adapters/analytics/key-result-data.interface'
import { NestJSGRPCService } from '@lib/grpc/grpc.interfaces'

import { AnalyticsDateWindow } from './analytics.enums'

export interface KeyResultGRPCService {
  getProgressHistory: (options: {
    keyResultId: string
    window?: AnalyticsDateWindow
    startDate?: string
  }) => NestJSGRPCService<AnalyticsGRPCResponse<PrimitiveProgressRecord[]>>

  calculateProgress: (options: {
    value: number
    keyResultData: KeyResultData
  }) => NestJSGRPCService<AnalyticsGRPCResponse<CalculatedProgress>>
}

export interface PrimitiveProgressRecord {
  id: string
  createdAt: string
  updatedAt: string
  progress: number
  keyResultId: string
  keyResultCheckInId: string
  date: string
}

interface CalculatedProgress {
  progress: number
}

interface AnalyticsGRPCResponse<T> {
  data: T
}
