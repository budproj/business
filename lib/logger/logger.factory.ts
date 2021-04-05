import { WinstonModule, utilities } from 'nest-winston'
import { transports, format } from 'winston'

import { LogLevel } from './logger.enum'

const { Console } = transports
const { combine, timestamp } = format

export function buildLogger(level?: LogLevel, serviceName?: string) {
  const logger = WinstonModule.createLogger({
    level,
    defaultMeta: { service: serviceName },
    transports: [
      new Console({
        format: combine(timestamp(), utilities.format.nestLike()),
      }),
    ],
  })

  return logger
}
