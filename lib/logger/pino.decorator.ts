/* eslint-disable @typescript-eslint/no-implicit-any-catch */
/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { omit } from 'lodash'
import { getLoggerToken, PinoLogger } from 'nestjs-pino'
import pino from 'pino'
import pinoPretty from 'pino-pretty'
// Import { Inject } from '@nestjs/common';
import * as uuid from 'uuid'

import { LogLevel } from './logger.enum'

interface Arguments {
  omitArgs?: boolean | Parameters<typeof omit>['1']
  includeReturn?: boolean
}
const mustShowExtensiveLogs = LogLevel[process.env.SERVER_LOGGING_LEVEL] === LogLevel.DEBUG

export const Stopwatch = ({ omitArgs, includeReturn }: Arguments = {}): MethodDecorator => {
  // Const injectLogger = Inject(PinoLogger);

  return <T extends Record<string, unknown>>(target, propertyKey, descriptor) => {
    const contextName = `${target.constructor.name}.${String(propertyKey)}`
    const token = getLoggerToken(contextName)

    // InjectLogger(target, token);
    target[token] = pino(
      pinoPretty({
        colorize: true,
      }),
    )

    const original = descriptor.value

    descriptor.value = new Proxy(original, {
      apply: (target, thisArgument, arguments_) => {
        const traceId = uuid.v4()
        const traceTag = `[${traceId}] ${contextName}`

        const logger: PinoLogger = thisArgument[token]

        const logCall = (argumentsList) => {
          if (mustShowExtensiveLogs) {
            logger.info(
              `${traceTag}(${argumentsList.map(() => '%o').join(', ')})`,
              // eslint-disable-next-line no-negated-condition
              ...argumentsList.map((argument) => (argument !== undefined ? argument : 'undefined')),
            )
          }
        }

        // TODO: reduce level to `debug`
        if (Array.isArray(omitArgs)) {
          logCall(Object.values(omit(arguments_, omitArgs)))
        } else if (omitArgs) {
          if (mustShowExtensiveLogs) {
            logger.info(`${traceTag}()`)
          }
        } else {
          logCall([...arguments_])
        }

        const start = Date.now()

        const handleResult = (res) => {
          if (mustShowExtensiveLogs) {
            logger.info(`${traceTag} took ${Date.now() - start}ms`)
          }

          if (includeReturn && res !== undefined && mustShowExtensiveLogs) {
            logger.info(`${traceTag} -> %o`, res)
          }

          return res
        }

        const handleError = (error) => {
          if (mustShowExtensiveLogs) {
            logger.error(`${traceTag} failed after ${Date.now() - start}ms -> %s`, error.message)
          }

          throw error
        }

        try {
          const result = target.apply(thisArgument, arguments_)

          if (result instanceof Promise) {
            return result.then(handleResult).catch(handleError)
          }

          handleResult(result)
          return result
        } catch (error) {
          handleError(error)
          throw error
        }
      },
    })

    // Copy all metadata from original descriptor.value to ensure the proper functioning of other decorators (like @Get, @Post, etc)
    for (const key of Reflect.getMetadataKeys(original)) {
      const metadata = Reflect.getMetadata(key, original)
      Reflect.defineMetadata(key, metadata, descriptor.value)
    }

    return descriptor
  }
}
