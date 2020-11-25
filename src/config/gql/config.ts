const { APP_ENV } = process.env

export interface GqlConfigOptions {
  debug: boolean
  playground: boolean
}

const config: GqlConfigOptions = {
  debug: APP_ENV !== 'production',
  playground: APP_ENV !== 'production',
}

export default config
