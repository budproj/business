import { existsSync, readFileSync } from 'fs'

import { LoggerService, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'

import { LoggingConfigInterface } from '@config/logging/logging.interface'
import { ServerConfigInterface } from '@config/server/server.interface'
import { buildLogger } from '@lib/logger/logger.factory'

import { ServerModule } from './server.module'
import { FastifyServerHTTPSOptions } from './types/fastify-server-https-options.type'
import { FastifyServerOptions } from './types/fastify-server-options.type'

export class ServerFactory {
  constructor(private readonly config: ServerConfigInterface) {}

  public async bootstrap(): Promise<void> {
    const fastifyServerOptions = this.buildFastifyServerOptions()

    const application = await NestFactory.create<NestFastifyApplication>(
      ServerModule,
      new FastifyAdapter(fastifyServerOptions),
    )

    const configService = application.get<ConfigService>(ConfigService)
    const { level, serviceName } = configService.get<LoggingConfigInterface>('logging')
    const logger = buildLogger(level, serviceName)

    this.setupServer(application, logger)
    await this.launchServer(application, logger)
  }

  private buildFastifyServerOptions(): FastifyServerOptions | undefined {
    const httpsConfig = this.buildHttpsConfig()
    if (!httpsConfig) return

    return {
      https: httpsConfig,
    }
  }

  private buildHttpsConfig(): FastifyServerHTTPSOptions | undefined {
    const { https } = this.config
    const isHttpsEnabled = https.enabled
    if (!isHttpsEnabled) return
    if (!https || !https?.credentialFilePaths) return

    const hasValidCredentials =
      existsSync(https.credentialFilePaths.key) && existsSync(https.credentialFilePaths.cert)
    if (!hasValidCredentials) return

    return {
      key: readFileSync(https.credentialFilePaths.key),
      cert: readFileSync(https.credentialFilePaths.cert),
    }
  }

  private setupServer(application: NestFastifyApplication, logger: LoggerService): void {
    const defaultGlobalPrefix = ''

    application.setGlobalPrefix(this.config.prefix ?? defaultGlobalPrefix)
    application.useLogger(logger)
    application.useGlobalPipes(
      new ValidationPipe({
        transform: true,
      }),
    )
    application.enableCors({
      credentials: this.config.cors.credentialsFlag,
      origin: this.config.cors.allowedOrigins,
    })
  }

  private async launchServer(
    application: NestFastifyApplication,
    logger: LoggerService,
  ): Promise<void> {
    const endpoint = this.getServerEndpoint()
    const { port, networkAddress } = this.config

    await application.listen(port, networkAddress)
    logger.log(`Started server listening on ${endpoint}`)
  }

  private getServerEndpoint() {
    const { host, port } = this.config
    const endpoint = `http://${host}:${port}`

    return endpoint
  }
}
