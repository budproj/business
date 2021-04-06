import { LoggerService, ValidationPipe } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

import { ServerConfigProvider } from '@config/server/server.provider'
import { buildLogger } from '@lib/logger/logger.factory'

import { ServerModule } from './server.module'

export class ServerFactory {
  public async bootstrap(): Promise<void> {
    const application = await NestFactory.create<NestFastifyApplication>(
      ServerModule,
      new FastifyAdapter(),
    )

    const config = application.get<ServerConfigProvider>(ServerConfigProvider)
    const logger = buildLogger(config.logging.level, config.logging.serviceName)

    this.setupServer(application, logger, config)
    await this.launchServer(application, logger, config)
  }

  private setupServer(
    application: NestFastifyApplication,
    logger: LoggerService,
    config: ServerConfigProvider,
  ): void {
    const defaultGlobalPrefix = ''

    application.setGlobalPrefix(config.prefix ?? defaultGlobalPrefix)
    application.useLogger(logger)
    application.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    )
    application.enableCors({
      credentials: config.cors.credentialsFlag,
      origin: config.cors.allowedOrigins,
    })
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
