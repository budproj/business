import { LoggerService } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import { processRequest } from 'graphql-upload'
import { Logger } from 'nestjs-pino'

import { ServerConfigProvider } from '@config/server/server.provider'

import { ServerModule } from './server.module'

export class ServerFactory {
  public async bootstrap(): Promise<void> {
    const adapter = new FastifyAdapter()
    const fastify = adapter.getInstance()

    fastify.addContentTypeParser('multipart', (request, done) => {
      request.isMultipart = true
      done()
    })

    fastify.addHook('preValidation', async function (request: any, reply) {
      if (!request.raw.isMultipart) {
        return
      }

      request.body = await processRequest(request.raw, reply.raw)
    })

    const application = await this.createApplication(adapter)

    await this.launch(application)
  }

  private async createApplication(adapter: FastifyAdapter): Promise<NestFastifyApplication> {
    const application = await NestFactory.create<NestFastifyApplication>(ServerModule, adapter)

    application.enableCors()

    return application
  }

  private async launch(application: NestFastifyApplication): Promise<void> {
    const config = application.get<ServerConfigProvider>(ServerConfigProvider)
    const logger = application.get(Logger)

    application.setGlobalPrefix(config.prefix ?? '')
    application.useLogger(logger)

    await this.launchMicroservices(application, config)
    await this.launchServer(application, logger, config)
  }

  private async launchMicroservices(
    application: NestFastifyApplication,
    config: ServerConfigProvider,
  ): Promise<void> {
    await application.startAllMicroservices()
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
}
