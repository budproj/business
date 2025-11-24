import multipart from '@fastify/multipart'
import { INestApplication } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { Logger } from 'nestjs-pino'

import { AppModule } from '@/app.module'
import { ServerConfigProvider } from '@config/server/server.provider'

export async function getServerConfig(
  serverModule: AppModule,
): Promise<{ app: INestApplication; PORT: number }> {
  const adapter = new FastifyAdapter()
  const fastify = adapter.getInstance()

  await fastify.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024,
      files: 5,
    },
  })

  const app = await NestFactory.create<NestFastifyApplication>(serverModule, adapter, {
    bufferLogs: true,
    logger: ['error', 'warn'],
  })

  const config = app.get<ServerConfigProvider>(ServerConfigProvider)
  const logger = app.get(Logger)

  app.enableCors()
  app.useLogger(logger)
  app.setGlobalPrefix(config.prefix ?? '')
  app.flushLogs()
  await app.startAllMicroservices()

  return { app, PORT: config.port }
}
