import { LogLevel } from '@lib/logger/logger.enum'

export interface ServerConfigInterface {
  port: number
  host: string
  networkAddress: string
  isCodespaces: boolean
  cors: ServerCORSConfigInterface
  logging: ServerLoggingConfigInterface
  prefix?: string
}

export interface ServerLoggingConfigInterface {
  level: LogLevel
  serviceName: string
}

export interface ServerCORSConfigInterface {
  credentialsEnabled: boolean
  allowedOrigins: string | string[]
}
