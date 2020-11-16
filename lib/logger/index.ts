import { cyan, grey } from 'chalk' // eslint-disable-line unicorn/import-style
import { TransformableInfo } from 'logform'
import { WinstonModule } from 'nest-winston'
import { transports, format } from 'winston'

const { Console } = transports
const { combine, timestamp, prettyPrint, colorize, printf } = format

export interface BudTransformableInfo extends TransformableInfo {
  timestamp: string
  label: string
}

const customFormat = ({ level, message, label, timestamp }: BudTransformableInfo) =>
  `${cyan('➤')} ${grey(`[${timestamp}]`)} ${label ?? '-'} ${level}: ${message}`

const Logger = WinstonModule.createLogger({
  level: 'info',
  defaultMeta: { service: 'bud@business' },
  format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), prettyPrint()),
  transports: [
    new Console({
      format: combine(colorize(), printf(customFormat)),
    }),
  ],
})

export default Logger
