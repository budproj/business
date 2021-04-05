import { LogLevel } from '@lib/logger/logger.enum'

export interface LoggingConfigInterface {
  level: LogLevel
  serviceName: string
}
