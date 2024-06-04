import { registerAs } from '@nestjs/config'

import { TypeORMConfigInterface } from './typeorm.interface'

export const typeormConfig = registerAs('typeorm', (): TypeORMConfigInterface => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const cliConfig = require('./typeorm-cli.config')

  return {
    type: cliConfig.type,

    endpoint: {
      host: cliConfig.host,
      port: cliConfig.port,
      host2: cliConfig.host2,
      port2: cliConfig.port2,
      database: cliConfig.database,
    },

    authentication: {
      user: cliConfig.username,
      password: cliConfig.password,
    },

    pattern: {
      file: {
        entities: cliConfig.entities,
        migrations: cliConfig.migrations,
      },

      directory: {
        migrations: cliConfig.cli.migrationsDir,
      },
    },

    logging: {
      enabled: cliConfig.logging,
    },

    poolSize: cliConfig.poolSize,

    conventions: {
      naming: cliConfig.namingStrategy,
    },

    extra: {
      max: cliConfig.extra.max,
      idleTimeoutMillis: cliConfig.extra.idleTimeoutMillis,
    },
  }
})
