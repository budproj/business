import { GqlConfigOptions } from './types'

const { APP_ENV, GRAPHQL_SCHEMA_FILE_PATH, CORS_ALLOWED_ORIGINS } = process.env

const config: GqlConfigOptions = {
  debug: APP_ENV !== 'production',
  playground: APP_ENV !== 'production',
  schemaFile: GRAPHQL_SCHEMA_FILE_PATH,
  cors: {
    credentials: true,
    origin: CORS_ALLOWED_ORIGINS?.split(',') ?? [],
  },
}

export default config
