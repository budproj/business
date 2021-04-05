import { loggingConfig } from './logging.config'
import { LoggingConfigInterface } from './logging.interface'

export function createLoggingConfig(): LoggingConfigInterface {
  return loggingConfig
}
