const { TYPEORM_HOST, TYPEORM_PORT, TYPEORM_USER, TYPEORM_PASSWORD, TYPEORM_LOGGING } = process.env

export interface TypeORMCLIOptions {
  migrationsDir: string
}

export interface DatabaseConfigOptions {
  type: string
  database: string
  migrations: string[]
  entities: string[]
  host: string
  port: number
  username: string
  password: string
  logging: boolean
  cli: TypeORMCLIOptions
}

const config: DatabaseConfigOptions = {
  type: 'postgres',
  database: 'business',
  migrations: ['src/migrations/**/*.ts'],
  entities: ['src/domain/**/entities.ts'],
  host: TYPEORM_HOST,
  port: Number.parseInt(TYPEORM_PORT, 10) || 5432,
  username: TYPEORM_USER,
  password: TYPEORM_PASSWORD,
  logging: Boolean(TYPEORM_LOGGING),
  cli: {
    migrationsDir: 'src/migrations/',
  },
}

export default config
