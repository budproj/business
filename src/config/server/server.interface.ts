import { LogLevel } from '@lib/logger/logger.enum'

export interface ServerConfigInterface {
  port: number
  host: string
  networkAddress: string
  isCodespaces: boolean
  logging: ServerLoggingConfigInterface
  prefix?: string
  rabbitmq: string
  cors: ServerCORSConfigInterface
}

export interface ServerLoggingConfigInterface {
  level: LogLevel
  serviceName: string
}

export interface ServerCORSConfigInterface {
  credentialsEnabled: boolean
  allowedOrigins: string[]
}
