import config from './config'
import { AppConfigOptions } from './types'

export * from './config'

const app = (): AppConfigOptions => config

export default app
