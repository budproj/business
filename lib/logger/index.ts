import { WinstonModule, utilities } from 'nest-winston'
import { transports, format } from 'winston'

const { Console } = transports
const { combine, timestamp } = format

export enum LOG_LEVEL {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}

export function buildLogger(level?: LOG_LEVEL, serviceName?: string) {
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
