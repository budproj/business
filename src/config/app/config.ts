import { LogLevel } from 'lib/logger'

import { AppConfigOptions } from './types'

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
  HTTPS_CERT,
  HTTPS_KEY,
  CORS_ALLOWED_ORIGINS,
  GOD_MODE_ENABLED,
  GOD_MODE_USER_ID,
  GOD_MODE_TEAM_ID,
} = process.env

const config: AppConfigOptions = {
  port: Number.parseInt(PORT, 10) ?? 3000,
  globalPrefix: GLOBAL_PREFIX ?? '',
  godMode: {
    enabled: GOD_MODE_ENABLED === 'true',
    userID: GOD_MODE_USER_ID,
    teamID: GOD_MODE_TEAM_ID,
  },

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

  https: {
    credentials: {
      key: HTTPS_KEY,
      cert: HTTPS_CERT,
    },
  },

  cors: {
    allowedOrigins: CORS_ALLOWED_ORIGINS?.split(',') ?? [],
  },
}

export default config
