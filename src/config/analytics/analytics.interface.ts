import { ServerCredentials } from '@grpc/grpc-js'

export interface AnalyticsConfig {
  grpcServer: AnalyticsGRPCServerConfig
}

export interface AnalyticsGRPCServerConfig {
  url: string
  credentials: ServerCredentials
  package: string[]
  protoPath: string[]
}
