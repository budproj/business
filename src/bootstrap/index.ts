import { readFileSync } from 'fs'

import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

import appConfig from 'config/app/config'
import buildLogger from 'lib/logger'

import BootstrapModule from './module'

async function bootstrap() {
  const https = {
    key: readFileSync(appConfig.https.credentials.key),
    cert: readFileSync(appConfig.https.credentials.cert),
  }

  const app = await NestFactory.create<NestFastifyApplication>(
    BootstrapModule,
    new FastifyAdapter({ https }),
  )

  const configService: ConfigService = app.get(ConfigService)
  const httpsConfig = configService.get('https')

  const logger = buildLogger(
    configService.get('logging.level'),
    configService.get('logging.serviceName'),
  )

  app.useLogger(logger)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )

  await app.listen(httpsConfig.port)
  logger.log(`Started server listening to port ${httpsConfig.port as string}`)
}

export default bootstrap
