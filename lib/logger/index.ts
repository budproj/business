import { TransformableInfo } from 'logform'
import { WinstonModule, utilities } from 'nest-winston'
import { transports, format } from 'winston'

const { Console } = transports
const { combine, timestamp } = format

export type LogLevel = 'debug' | 'info' | 'warn' | 'error'

export interface BudTransformableInfo extends TransformableInfo {
  timestamp: string
  label: string
}

const buildLogger = (level: LogLevel, serviceName: string) => {
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

export default buildLogger
