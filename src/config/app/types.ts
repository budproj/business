import { LogLevel } from 'lib/logger'
import { TeamDTO } from 'src/domain/team/dto'
import { UserDTO } from 'src/domain/user/dto'

export interface AppConfigOptions {
  port: number
  globalPrefix: string
  godMode: GodModuleConfigOptions
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

export interface GodModuleConfigOptions {
  enabled: boolean
  userID: UserDTO['id']
  teamID: TeamDTO['id']
}
