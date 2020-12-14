export interface GqlConfigOptions {
  debug: boolean
  playground: boolean
  schemaFile: string
  cors: GqlCorsOptions
}

export interface GqlCorsOptions {
  credentials: boolean
  origin: string | string[]
}
