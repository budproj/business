import { LogLevel } from 'lib/logger'

const {
  PORT,
  AUTH0_CLIENT_ID,
  AUTH0_CLIENT_SECRET,
  AUTH0_ISSUER,
  AUTH0_AUDIENCE,
  AUTH0_NAMESPACE,
  GLOBAL_PREFIX,
  LOGGING_LEVEL,
  LOGGING_SERVICE_NAME,
  GOD_MODE_ENABLED,
} = process.env

export interface LoggingConfigOptions {
  level: LogLevel
  serviceName: string
}

export interface AuthzConfigOptions {
  clientID: string
  clientSecret: string
  issuer: string
  audience: string
  namespace: string
}

export interface AppConfigOptions {
  port: number
  globalPrefix: string
  godMode: boolean
  authz: AuthzConfigOptions
  logging: LoggingConfigOptions
}

const config: AppConfigOptions = {
  port: Number.parseInt(PORT, 10) || 3000,
  globalPrefix: GLOBAL_PREFIX || '',
  godMode: GOD_MODE_ENABLED === 'true',

  authz: {
    clientID: AUTH0_CLIENT_ID,
    clientSecret: AUTH0_CLIENT_SECRET,
    issuer: AUTH0_ISSUER,
    audience: AUTH0_AUDIENCE,
    namespace: AUTH0_NAMESPACE,
  },

  logging: {
    level: LOGGING_LEVEL as LogLevel,
    serviceName: LOGGING_SERVICE_NAME,
  },
}

export default config
