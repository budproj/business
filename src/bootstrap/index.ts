import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

import buildLogger from 'lib/logger'

import BootstrapModule from './module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    BootstrapModule,
    new FastifyAdapter(),
  )

  const configService: ConfigService = app.get(ConfigService)

  const logger = buildLogger(
    configService.get('logging.level'),
    configService.get('logging.serviceName'),
  )

  app.useGlobalPipes(new ValidationPipe())
  app.useLogger(logger)

  await app.listen(configService.get('port'))
}

export default bootstrap
