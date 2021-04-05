import { ServerConfigInterface } from './server.interface'

const {
  SERVER_PORT,
  SERVER_HOST,
  SERVER_PREFIX,
  SERVER_NETWORK_ADDRESS,
  SERVER_HTTPS_ENABLED,
  SERVER_HTTPS_KEY_FILE_PATH,
  SERVER_HTTPS_CERT_FILE_PATH,
  SERVER_CORS_CREDENTIALS_FLAG,
  SERVER_CORS_ALLOWED_ORIGINS,
  CODESPACES,
} = process.env

const DEFAULT_PORT = 3000
const DEFAULT_HOST = 'localhost'
const DEFAULT_NETWORK_ADDRESS = '0.0.0.0'
const DEFAULT_HTTPS_ENABLED = false
const DEFAULT_CORS_CREDENTIALS_FLAG = true
const DEFAULT_CORS_ALLOWED_ORIGINS = ['*']

export const serverConfig: ServerConfigInterface = {
  port: SERVER_PORT ? Number.parseInt(SERVER_PORT, 10) : DEFAULT_PORT,
  host: SERVER_HOST ?? DEFAULT_HOST,
  networkAddress: SERVER_NETWORK_ADDRESS ?? DEFAULT_NETWORK_ADDRESS,
  isCodespaces: CODESPACES?.toUpperCase() === 'TRUE',
  prefix: SERVER_PREFIX,

  https: {
    enabled: SERVER_HTTPS_ENABLED?.toUpperCase() === 'TRUE' ?? DEFAULT_HTTPS_ENABLED,
    credentialFilePaths: {
      key: SERVER_HTTPS_KEY_FILE_PATH,
      cert: SERVER_HTTPS_CERT_FILE_PATH,
    },
  },

  cors: {
    credentialsFlag:
      SERVER_CORS_CREDENTIALS_FLAG?.toUpperCase() === 'TRUE' ?? DEFAULT_CORS_CREDENTIALS_FLAG,
    allowedOrigins: SERVER_CORS_ALLOWED_ORIGINS?.split(',') ?? DEFAULT_CORS_ALLOWED_ORIGINS,
  },
}
