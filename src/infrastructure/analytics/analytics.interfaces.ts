import { NestJSGRPCService } from '@lib/grpc/grpc.interfaces'

import { AnalyticsDateWindow } from './analytics.enums'

export interface KeyResultGRPCService {
  getProgressHistory: (options: {
    keyResultId: string
    window?: AnalyticsDateWindow
    startDate?: string
  }) => NestJSGRPCService<AnalyticsGRPCResponse<PrimitiveProgressRecord[]>>

  getProgressHistoryWithStaticHead: (options: {
    keyResultId: string
    window?: AnalyticsDateWindow
    startDate?: string
    headKeyResultCheckInData: KeyResultCheckInData
  }) => NestJSGRPCService<AnalyticsGRPCResponse<PrimitiveProgressRecord[]>>
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

export interface AnalyticsGRPCResponse<T> {
  data: T
}

interface KeyResultCheckInData {
  value: number
  createdAt: Date
}
