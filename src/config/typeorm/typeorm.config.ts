import { registerAs } from '@nestjs/config'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

import { TypeORMConfigInterface } from './typeorm.interface'

export const typeormConfig = registerAs(
  'typeorm',
  (): TypeORMConfigInterface => ({
    type: process.env.TYPEORM_CONNECTION,

    endpoint: {
      host: process.env.TYPEORM_HOST,
      port: Number.parseInt(process.env.TYPEORM_PORT, 10),
      database: process.env.TYPEORM_DATABASE,
    },

    authentication: {
      user: process.env.TYPEORM_USERNAME,
      password: process.env.TYPEORM_PASSWORD,
    },

    pattern: {
      file: {
        entities: process.env.TYPEORM_ENTITIES.split(','),
        migrations: process.env.TYPEORM_MIGRATIONS.split(','),
      },

      directory: {
        migrations: process.env.TYPEORM_MIGRATIONS_DIR,
      },
    },

    logging: {
      enabled: process.env.TYPEORM_LOGGING_ENABLED === 'true',
    },

    conventions: {
      naming:
        process.env.TYPEORM_CONVENTION_NAMING_ENABLED === 'true'
          ? new SnakeNamingStrategy()
          : undefined,
    },
  }),
)
