import { ConnectionOptions } from 'typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies/snake-naming.strategy'

import { testConfig } from 'lib/jest/typeorm'

const {
  NODE_ENV,
  TYPEORM_HOST,
  TYPEORM_PORT,
  TYPEORM_DATABASE,
  TYPEORM_USER,
  TYPEORM_PASSWORD,
  TYPEORM_LOGGING,
} = process.env

const config: ConnectionOptions =
  NODE_ENV === 'test'
    ? testConfig
    : {
        type: 'postgres',
        database: TYPEORM_DATABASE,
        migrations: ['dist/src/database/migrations/**/*.js'],
        entities: ['dist/src/domain/**/entities.js'],
        host: TYPEORM_HOST,
        port: Number.parseInt(TYPEORM_PORT, 10) || 5432,
        username: TYPEORM_USER,
        password: TYPEORM_PASSWORD,
        logging: Boolean(TYPEORM_LOGGING),
        namingStrategy: new SnakeNamingStrategy(),
        cli: {
          migrationsDir: 'src/database/migrations/',
        },
      }

export default config
