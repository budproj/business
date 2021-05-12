import { registerAs } from '@nestjs/config'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

import { TypeORMConfigInterface } from './typeorm.interface'

const config = {
  type: process.env.TYPEORM_CONNECTION,
  database: process.env.TYPEORM_DATABASE,
  host: process.env.TYPEORM_HOST,
  port: Number.parseInt(process.env.TYPEORM_PORT, 10),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  migrations: process.env.TYPEORM_MIGRATIONS.split(','),
  entities: process.env.TYPEORM_ENTITIES.split(','),
  logging: process.env.TYPEORM_LOGGING_ENABLED === 'true',
  namingStrategy:
    process.env.TYPEORM_CONVENTION_NAMING_ENABLED === 'true'
      ? new SnakeNamingStrategy()
      : undefined,
  cli: {
    migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR,
  },
}

export const typeormConfig = registerAs(
  'typeorm',
  (): TypeORMConfigInterface => ({
    type: config.type,

    endpoint: {
      host: config.host,
      port: config.port,
      database: config.database,
    },

    authentication: {
      user: config.username,
      password: config.password,
    },

    pattern: {
      file: {
        entities: config.entities,
        migrations: config.migrations,
      },

      directory: {
        migrations: config.cli.migrationsDir,
      },
    },

    logging: {
      enabled: config.logging,
    },

    conventions: {
      naming: config.namingStrategy,
    },
  }),
)
