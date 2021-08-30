import { ChannelCredentials } from '@grpc/grpc-js'

export interface AnalyticsConfig {
  grpcServer: AnalyticsGRPCServerConfig
}

export interface AnalyticsGRPCServerConfig {
  url: string
  credentials: ChannelCredentials
  package: string[]
  protoPath: string[]
}
