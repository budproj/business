import { NamingStrategyInterface } from 'typeorm'

export interface TypeORMConfigInterface {
  type: string
  endpoint: TypeORMEndpointConfigInterface
  authentication: TypeORMAuthenticationConfigInterface
  pattern: TypeORMPatternConfigInterface
  logging: TypeORMLoggingConfigInterface
  convention: TypeORMConventionConfigInterface
}

interface TypeORMEndpointConfigInterface {
  host: string
  port: number
  database: string
}

interface TypeORMAuthenticationConfigInterface {
  user?: string
  password?: string
}

interface TypeORMPatternConfigInterface {
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

interface TypeORMLoggingConfigInterface {
  enabled: boolean
}

interface TypeORMConventionConfigInterface {
  naming?: NamingStrategyInterface
}
