import { LOG_LEVEL } from '@lib/logger'

export type LoggingConfig = {
  level: LOG_LEVEL
  serviceName: string
}

const { LOGGING_LEVEL, LOGGING_SERVICE_NAME } = process.env

const DEFAULT_LOGGING_LEVEL = LOG_LEVEL.ERROR
const DEFAULT_LOGGING_SERVICE_NAME = 'business@unknown'
const uppercasedLoggingLevel = LOGGING_LEVEL?.toUpperCase()

export const loggingConfig: LoggingConfig = {
  level:
    uppercasedLoggingLevel && uppercasedLoggingLevel in LOG_LEVEL
      ? (LOG_LEVEL as any)[uppercasedLoggingLevel]
      : DEFAULT_LOGGING_LEVEL,
  serviceName: LOGGING_SERVICE_NAME ?? DEFAULT_LOGGING_SERVICE_NAME,
}

export function createLoggingConfig(): LoggingConfig {
  return loggingConfig
}
