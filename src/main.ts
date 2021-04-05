import { existsSync, readFileSync } from 'fs'

import { LoggerService, ValidationPipe } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { NestFactory } from '@nestjs/core'
import { FastifyAdapter, NestFastifyApplication } from '@nestjs/platform-fastify'
import * as localtunnel from 'localtunnel'

import { LoggingConfigInterface } from '@config/logging/logging.interface'
import { createServerConfig } from '@config/server/server.factory'
import { ServerConfigInterface } from '@config/server/server.interface'
import { buildLogger } from '@lib/logger/logger.factory'

import { BootstrapModule } from './bootstrap.module'

type CustomFastifyServerOptions = {
  https: CustomFastifyServerHTTPSOptions
}

type CustomFastifyServerHTTPSOptions = {
  key: Buffer
  cert: Buffer
}

async function bootstrap(): Promise<void> {
  const serverConfig = createServerConfig()
  const fastifyServerOptions = buildFastifyServerOptions(serverConfig)

  const application = await NestFactory.create<NestFastifyApplication>(
    BootstrapModule,
    new FastifyAdapter(fastifyServerOptions),
  )

  const configService = application.get<ConfigService>(ConfigService)
  const loggingConfig = configService.get<LoggingConfigInterface>('logging')

  const logger = buildLogger(loggingConfig?.level, loggingConfig?.serviceName)

  setupServer(application, logger, serverConfig)
  await launchServer(application, logger, serverConfig)
}

function buildFastifyServerOptions(
  serverConfig: ServerConfigInterface,
): CustomFastifyServerOptions | undefined {
  const httpsConfig = buildHttpsConfig(serverConfig)
  if (!httpsConfig) return

  return {
    https: httpsConfig,
  }
}

function buildHttpsConfig({
  https,
}: ServerConfigInterface): CustomFastifyServerHTTPSOptions | undefined {
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

function setupServer(
  application: NestFastifyApplication,
  logger: LoggerService,
  serverConfig: ServerConfigInterface,
): void {
  const defaultGlobalPrefix = ''

  application.setGlobalPrefix(serverConfig?.prefix ?? defaultGlobalPrefix)
  application.useLogger(logger)
  application.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  )
  application.enableCors({
    credentials: serverConfig.cors.credentialsFlag,
    origin: serverConfig.cors.allowedOrigins,
  })
}

async function launchServer(
  application: NestFastifyApplication,
  logger: LoggerService,
  serverConfig: ServerConfigInterface,
): Promise<void> {
  const endpoint = await getServerEndpoint(serverConfig)

  await application.listen(serverConfig.port, serverConfig.networkAddress)
  logger.log(`Started server listening on ${endpoint}`)
}

async function getServerEndpoint(serverConfig: ServerConfigInterface) {
  const tunnel = serverConfig.isCodespaces && (await localtunnel({ port: serverConfig.port }))
  const endpoint = tunnel?.url ?? buildServerEndpoint(serverConfig)

  return endpoint
}

function buildServerEndpoint(serverConfig: ServerConfigInterface) {
  const endpoint = `http://${serverConfig.host}:${serverConfig.port}`

  return endpoint
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
bootstrap()
