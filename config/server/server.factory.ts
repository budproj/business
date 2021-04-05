import { serverConfig } from './server.config'
import { ServerConfigInterface } from './server.interface'

export function createServerConfig(): ServerConfigInterface {
  return serverConfig
}
