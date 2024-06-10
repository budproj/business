import { NamingStrategyInterface } from 'typeorm'

export interface TypeORMConfigInterface {
  type: string
  endpoint: TypeORMEndpointConfigInterface
  authentication: TypeORMAuthenticationConfigInterface
  pattern: TypeORMPatternConfigInterface
  logging: TypeORMLoggingConfigInterface
  poolSize: number
  conventions: TypeORMConventionsConfigInterface
  extra: TypeORMExtraConfigInterface
}

export interface TypeORMExtraConfigInterface {
  max: number
  idleTimeoutMillis: number
}

export interface TypeORMEndpointConfigInterface {
  host: string
  port: number
  host2: string
  port2: number
  database: string
}

export interface TypeORMAuthenticationConfigInterface {
  user?: string
  password?: string
}

export interface TypeORMPatternConfigInterface {
  file: TypeORMFilePatternConfigInterface
  directory: TypeORMDirectoryPatternConfigInterface
}

interface TypeORMFilePatternConfigInterface {
  entities: string[]
  migrations: string[]
}

interface TypeORMDirectoryPatternConfigInterface {
  migrations: string
}

export interface TypeORMLoggingConfigInterface {
  enabled: boolean
}

export interface TypeORMConventionsConfigInterface {
  naming?: NamingStrategyInterface
}
