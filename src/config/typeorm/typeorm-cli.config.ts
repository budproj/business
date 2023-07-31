import { SnakeNamingStrategy } from 'typeorm-naming-strategies'

export = {
  type: process.env.TYPEORM_CONNECTION_TYPE,
  host: process.env.TYPEORM_HOST,
  port: Number.parseInt(process.env.TYPEORM_PORT, 10),
  username: process.env.TYPEORM_USERNAME,
  password: process.env.TYPEORM_PASSWORD,
  database: process.env.TYPEORM_DATABASE,
  logging: process.env.TYPEORM_LOGGING_ENABLED === 'true',
  poolSize: Number.parseInt(process.env.TYPEORM_MAX_CONNECTION_POOL, 10),
  namingStrategy: process.env.TYPEORM_CONVENTION_NAMING_ENABLED === 'true' ? new SnakeNamingStrategy() : undefined,
  migrations: process.env.TYPEORM_MIGRATIONS.split(','),
  entities: process.env.TYPEORM_ENTITIES.split(','),
  cli: {
    migrationsDir: process.env.TYPEORM_MIGRATIONS_DIR,
  },
  extra: {
    max: Number.parseInt(process.env.TYPEORM_MAX_CONNECTION_POOL, 10),
    idleTimeoutMillis: Number.parseInt(process.env.TYPEORM_CONNECTION_POOL_TIMEOUT_S, 10) * 1000,
  },
}
