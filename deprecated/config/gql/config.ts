import { GqlConfigOptions } from './types'

const { APP_ENV, GRAPHQL_SCHEMA_FILE_PATH } = process.env

const config: GqlConfigOptions = {
  debug: APP_ENV !== 'production',
  playground: APP_ENV !== 'production',
  introspection: APP_ENV !== 'production',
  schemaFile: GRAPHQL_SCHEMA_FILE_PATH,
}

export default config
