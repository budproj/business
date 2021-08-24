import { NestJSGRPCService } from '@lib/grpc/grpc.interfaces'

import { AnalyticsDateWindow } from './analytics.enums'

export interface KeyResultGRPCService {
  getProgressHistory: (options: {
    keyResultId: string
    window?: AnalyticsDateWindow
    startDate?: string
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

interface AnalyticsGRPCResponse<T> {
  data: T
}
