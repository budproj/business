import config, { AppConfigOptions } from './config'

export * from './config'

const app = (): AppConfigOptions => config

export default app
