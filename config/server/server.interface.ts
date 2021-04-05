export interface ServerConfigInterface {
  port: number
  host: string
  networkAddress: string
  isCodespaces: boolean
  https: ServerHttpsConfigInterface
  cors: ServerCORSConfigInterface
  prefix?: string
}

interface ServerHttpsConfigInterface {
  enabled: boolean
  credentialFilePaths?: ServerHttpsCredentialFilePathsInterface
}

interface ServerHttpsCredentialFilePathsInterface {
  key: string
  cert: string
}

interface ServerCORSConfigInterface {
  credentialsFlag: boolean
  allowedOrigins: string | string[]
}
