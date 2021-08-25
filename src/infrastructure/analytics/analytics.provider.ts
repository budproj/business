import { Inject, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'

import { AnalyticsAdapter } from '@adapters/analytics/adapter.interface'
import { KeyResultData } from '@adapters/analytics/key-result-data.interface'
import { ProgressRecord } from '@adapters/analytics/progress-record.interface'

import { AnalyticsDateWindow } from './analytics.enums'
import { KeyResultGRPCService, PrimitiveProgressRecord } from './analytics.interfaces'

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
  ): Promise<ProgressRecord[]> {
    const options = {
      keyResultId,
      window: AnalyticsDateWindow.WEEK,
    }
    const response = await this.keyResultGRPCService.getProgressHistory(options).toPromise()

    return response.data.map((progressRecord) =>
      AnalyticsProvider.marshalProgressRecord(progressRecord),
    )
  }

  public async calculateProgress(value: number, keyResultData: KeyResultData): Promise<number> {
    const options = {
      value,
      keyResultData,
    }
    const response = await this.keyResultGRPCService.calculateProgress(options).toPromise()

    return response.data.progress
  }
}
