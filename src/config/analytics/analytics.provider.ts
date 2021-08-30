import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { GrpcOptions, Transport } from '@nestjs/microservices'

import { AnalyticsGRPCServerConfig } from './analytics.interface'

@Injectable()
export class AnalyticsConfigProvider {
  constructor(private readonly configService: ConfigService) {}

  get grpcServer(): AnalyticsGRPCServerConfig {
    return this.configService.get<AnalyticsGRPCServerConfig>('analytics.grpcServer')
  }

  get connection(): GrpcOptions {
    return {
      transport: Transport.GRPC,
      options: this.grpcServer,
    }
  }
}
