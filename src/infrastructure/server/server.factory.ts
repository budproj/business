import { LoggerService, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { processRequest } from 'graphql-upload'

import { ServerConfigProvider } from '@config/server/server.provider'
import { buildLogger } from '@lib/logger/logger.factory'

import { ServerModule } from './server.module'

export class ServerFactory {
  public async bootstrap(): Promise<void> {
    const fastifyAdapter = await this.createFastifyAdapter()
    const application = await this.createApplication(fastifyAdapter)

    await this.launch(application)
  }

  private async createFastifyAdapter(): Promise<FastifyAdapter> {
    const adapter = new FastifyAdapter()
    this.applyMultipartFix(adapter)

    return adapter
  }

  private async createApplication(adapter: FastifyAdapter): Promise<NestFastifyApplication> {
    const application = await NestFactory.create<NestFastifyApplication>(ServerModule, adapter)

    return application
  }

  private async launch(application: NestFastifyApplication): Promise<void> {
    const config = application.get<ServerConfigProvider>(ServerConfigProvider)
    const logger = buildLogger(config.logging.level, config.logging.serviceName)

    application.setGlobalPrefix(config.prefix ?? '')
    application.useLogger(logger)
    application.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    )
    application.enableCors({
      credentials: config.cors.credentialsEnabled,
      origin: config.cors.allowedOrigins,
    })

    await this.launchServer(application, logger, config)
  }

  private async launchServer(
    application: NestFastifyApplication,
    logger: LoggerService,
    config: ServerConfigProvider,
  ): Promise<void> {
    const endpoint = this.getServerEndpoint(config)

    await application.listen(config.port, config.networkAddress)
    logger.log(`Started server listening on ${endpoint}`)
  }

  private getServerEndpoint(config: ServerConfigProvider) {
    const endpoint = `http://${config.host}:${config.port}`

    return endpoint
  }

  private applyMultipartFix(adapter: FastifyAdapter): void {
    const fastify = adapter.getInstance()

    fastify.addContentTypeParser('multipart', (request, done) => {
      request.isMultipart = true
      done()
    })

    fastify.addHook('preValidation', async function (request: any, reply) {
      if (!request.raw.isMultipart) {
        return
      }

      request.body = await processRequest(request.raw, reply.raw, {})
    })
  }
}
