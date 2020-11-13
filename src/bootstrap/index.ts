import { ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

import Logger from 'lib/logger'

import BootstrapModule from './module'

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    BootstrapModule,
    new FastifyAdapter(),
  )

  app.useGlobalPipes(new ValidationPipe())
  app.useLogger(Logger)

  const configService: ConfigService = app.get(ConfigService)

  await app.listen(configService.get('port'))
}

export default bootstrap
