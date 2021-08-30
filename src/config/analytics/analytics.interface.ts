export interface AnalyticsConfig {
  grpcServer: AnalyticsGRPCServerConfig
}

export interface AnalyticsGRPCServerConfig {
  url: string
  package: string[]
  protoPath: string[]
}
