import { LogLevel } from '@lib/logger/logger.enum'

import { LoggingConfigInterface } from './logging.interface'

const { LOGGING_LEVEL, LOGGING_SERVICE_NAME } = process.env

const DEFAULT_LOGGING_LEVEL = LogLevel.ERROR
const DEFAULT_LOGGING_SERVICE_NAME = 'business@unknown'
const uppercasedLoggingLevel = LOGGING_LEVEL?.toUpperCase()

export const loggingConfig: LoggingConfigInterface = {
  level:
    uppercasedLoggingLevel && uppercasedLoggingLevel in LogLevel
      ? (LogLevel as any)[uppercasedLoggingLevel]
      : DEFAULT_LOGGING_LEVEL,
  serviceName: LOGGING_SERVICE_NAME ?? DEFAULT_LOGGING_SERVICE_NAME,
}
