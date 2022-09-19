import { registerAs } from '@nestjs/config'

import { LogLevel } from '@lib/logger/logger.enum'

import { ServerConfigInterface } from './server.interface'

export const serverConfig = registerAs(
  'server',
  (): ServerConfigInterface => ({
    port: Number.parseInt(process.env.SERVER_PORT, 10),
    host: process.env.SERVER_HOST,
    networkAddress: process.env.SERVER_NETWORK_ADDRESS,
    isCodespaces: process.env.CODESPACES === 'true',
    prefix: process.env.SERVER_PREFIX,

    logging: {
      level: LogLevel[process.env.SERVER_LOGGING_LEVEL],
      serviceName: process.env.SERVER_LOGGING_SERVICE_NAME,
    },

    nats: process.env.TASKS_NATS_SERVERS.split(','),
  }),
)
