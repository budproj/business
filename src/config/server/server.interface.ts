import { LogLevel } from '@lib/logger/logger.enum'

export interface ServerConfigInterface {
  port: number
  host: string
  networkAddress: string
  isCodespaces: boolean
  logging: ServerLoggingConfigInterface
  prefix?: string
}

export interface ServerLoggingConfigInterface {
  level: LogLevel
  serviceName: string
}
