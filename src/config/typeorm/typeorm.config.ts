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

    conventions: {
      naming: cliConfig.namingStrategy,
    },

    extra: {
      max: cliConfig.extra.max,
    },
  }
})
