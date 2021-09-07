import { Inject, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'

import { AnalyticsAdapter } from '@adapters/analytics/adapter.interface'
import { ProgressRecord } from '@adapters/analytics/progress-record.interface'
import { KeyResultCheckIn } from '@core/modules/key-result/check-in/key-result-check-in.orm-entity'

import { AnalyticsDateWindow } from './analytics.enums'
import {
  AnalyticsGRPCResponse,
  KeyResultGRPCService,
  PrimitiveProgressRecord,
} from './analytics.interfaces'

export class AnalyticsProvider implements OnModuleInit, AnalyticsAdapter {
  private keyResultGRPCService: KeyResultGRPCService

  constructor(@Inject('ANALYTICS_GRPC_SERVER') private readonly client: ClientGrpc) {}

  static marshalProgressRecord(primitiveValues: PrimitiveProgressRecord): ProgressRecord {
    return {
      ...primitiveValues,
      createdAt: new Date(primitiveValues.createdAt),
      updatedAt: new Date(primitiveValues.updatedAt),
      date: new Date(primitiveValues.date),
    }
  }

  public onModuleInit() {
    this.keyResultGRPCService = this.client.getService('KeyResultService')
  }

  public async getWeeklyProgressHistoryForKeyResult(
    keyResultId: string,
    headKeyResultCheckInData?: KeyResultCheckIn,
    startDate?: Date,
  ): Promise<ProgressRecord[]> {
    const handle = async () =>
      headKeyResultCheckInData
        ? this.getWeeklyProgressWithStaticHead(keyResultId, headKeyResultCheckInData, startDate)
        : this.getHistoricWeeklyProgress(keyResultId, startDate)

    const response = await handle()
    const data = response?.data ?? []

    return data.map((progressRecord) => AnalyticsProvider.marshalProgressRecord(progressRecord))
  }

  private async getWeeklyProgressWithStaticHead(
    keyResultId: string,
    headKeyResultCheckInData?: KeyResultCheckIn,
    startDate?: Date,
  ): Promise<AnalyticsGRPCResponse<PrimitiveProgressRecord[]>> {
    const options = {
      keyResultId,
      startDate: startDate.toString(),
      window: AnalyticsDateWindow.WEEK,
      headKeyResultCheckInData,
    }

    return this.keyResultGRPCService.getProgressHistoryWithStaticHead(options).toPromise()
  }

  private async getHistoricWeeklyProgress(
    keyResultId: string,
    startDate?: Date,
  ): Promise<AnalyticsGRPCResponse<PrimitiveProgressRecord[]>> {
    const options = {
      keyResultId,
      startDate: startDate.toString(),
      window: AnalyticsDateWindow.WEEK,
    }

    return this.keyResultGRPCService.getProgressHistory(options).toPromise()
  }
}
