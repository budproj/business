import { LogLevel } from 'lib/logger'

export interface AppConfigOptions {
  port: number
  globalPrefix: string
  godMode: boolean
  authz: AuthzConfigOptions
  logging: LoggingConfigOptions
  https: HttpsConfigOptions
  cors: CorsConfigOptions
}

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

export interface HttpsConfigOptions {
  credentials: HttpsCredentialsConfigOptions
}

export interface HttpsCredentialsConfigOptions {
  key?: string
  cert?: string
}

export interface CorsConfigOptions {
  allowedOrigins: string | string[]
}
