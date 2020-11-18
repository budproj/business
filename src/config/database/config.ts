import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies/snake-naming.strategy'

const { TYPEORM_HOST, TYPEORM_PORT, TYPEORM_USER, TYPEORM_PASSWORD, TYPEORM_LOGGING } = process.env

const config: TypeOrmModuleOptions = {
  type: 'postgres',
  database: 'business',
  migrations: ['dist/src/migrations/**/*.js'],
  entities: ['dist/src/domain/**/entities.js'],
  host: TYPEORM_HOST,
  port: Number.parseInt(TYPEORM_PORT, 10) || 5432,
  username: TYPEORM_USER,
  password: TYPEORM_PASSWORD,
  logging: Boolean(TYPEORM_LOGGING),
  namingStrategy: new SnakeNamingStrategy(),
  cli: {
    migrationsDir: 'src/migrations/',
  },
}

export default config
