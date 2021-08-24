import { Inject, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'

import { AnalyticsAdapter } from '@adapters/analytics/adapter.interface'
import { ProgressRecord } from '@adapters/analytics/progress-record.interface'

import { AnalyticsDateWindow } from './analytics.enums'
import { KeyResultGRPCService } from './analytics.interfaces'

export class AnalyticsProvider implements OnModuleInit, AnalyticsAdapter {
  private keyResultGRPCService: KeyResultGRPCService

  constructor(@Inject('ANALYTICS_GRPC_SERVER') private readonly client: ClientGrpc) {}

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

    return response.data
  }
}
