import { existsSync, readFileSync } from 'fs'

import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

import appConfig from 'config/app/config'
import buildLogger from 'lib/logger'

import BootstrapModule from './module'

async function bootstrap() {
  const httpsConfig = buildHttpsConfig()
  const options = httpsConfig ? { https: httpsConfig } : undefined

  const app = await NestFactory.create<NestFastifyApplication>(
    BootstrapModule,
    new FastifyAdapter(options),
  )

  const configService: ConfigService = app.get(ConfigService)

  const logger = buildLogger(
    configService.get('logging.level'),
    configService.get('logging.serviceName'),
  )

  app.setGlobalPrefix(configService.get('globalPrefix'))
  app.useLogger(logger)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )

  const allowedOrigins = configService.get('cors.allowedOrigins')
  app.enableCors({
    credentials: true,
    origin: allowedOrigins,
  })

  await app.listen(configService.get('port'), '0.0.0.0')
  logger.log(`Started server listening to port ${appConfig.port.toString()}`)
}

const buildHttpsConfig = () => {
  const isHttps =
    existsSync(appConfig.https.credentials.key) && existsSync(appConfig.https.credentials.cert)

  const httpsConfig = isHttps
    ? {
        key: readFileSync(appConfig.https.credentials.key),
        cert: readFileSync(appConfig.https.credentials.cert),
      }
    : {}

  return httpsConfig
}

export default bootstrap
