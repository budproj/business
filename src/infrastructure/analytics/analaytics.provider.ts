import { Inject, OnModuleInit } from '@nestjs/common'
import { ClientGrpc } from '@nestjs/microservices'

import { AnalyticsGRPCService } from './analytics.grpc-interface'

export class AnalyticsProvider implements OnModuleInit {
  private analyticsGRPCService: AnalyticsGRPCService

  constructor(@Inject('ANALYTICS_GRPC_SERVICE') private readonly client: ClientGrpc) {}

  public onModuleInit() {
    this.analyticsGRPCService = this.client.getService<AnalyticsGRPCService>('AnalyticsService')
  }

  public test(): any {
    return this.analyticsGRPCService.findOne('TEST')
  }
}
